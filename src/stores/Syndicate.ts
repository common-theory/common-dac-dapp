import { observable } from 'mobx';
import BN from 'bn.js';
import ABI from './SyndicateABI';

export class Payment {
  index: number;
  sender: string;
  receiver: string;
  timestamp: string|number|BN;
  time: string|number|BN;
  weiValue: string|number|BN;
  weiPaid: string|number|BN;
  isFork: boolean;
  parentIndex: string|number|BN;

  constructor(obj: any) {
    this.index = obj.index;
    this.sender = obj.sender;
    this.receiver = obj.receiver;
    this.timestamp = obj.timestamp;
    this.time = obj.time;
    this.weiValue = obj.weiValue;
    this.weiPaid = obj.weiPaid;
    this.isFork = obj.isFork;
    this.parentIndex = obj.parentIndex;
  }

  get weiOwed() {
    if (isNaN(+this.weiValue) || isNaN(+this.timestamp) || isNaN(+this.time) || isNaN(+this.weiPaid)) return 0;
    if (+this.time === 0) return 0;
    if (+this.weiValue === 0) return 0;
    const now = Math.floor(+new Date() / 1000);
    const weiValue = new BN(this.weiValue);
    const weiPaid = new BN(this.weiPaid);
    const timeOffset = new BN(Math.min(now - +this.timestamp, +this.time));
    const totalWeiOwed = weiValue.mul(timeOffset).div(new BN(this.time));
    if (totalWeiOwed.lt(weiPaid)) {
      return new BN('0');
    } else {
      return totalWeiOwed.sub(weiPaid);
    }
  }

  get settled() {
    return this.weiPaid === this.weiValue;
  }

  get timeRemaining() {
    return Math.max(0, +this.time - (Math.floor(+new Date() / 1000) - +this.timestamp));
  }
}

export default class SyndicateStore {

  private contract: any;
  @observable payments: Payment[] = [];
  @observable paymentCount: number = 0;
  @observable balance: string|BN = '0';

  constructor(networkId: number) {
    this.reloadContract(networkId);
  }

  reloadContract(networkId: number) {
    this.contract = new web3.eth.Contract(ABI, this.addressForNetwork(networkId));
    this.payments = [];
    this.paymentCount = 0;
    this.loadBalance();
    this.loadPayments(0, 100)
      .catch((err: any) => console.log('Error reloading contract: ', err));
    this.contract.events.PaymentCreated()
      .on('data', (event: any) => {
        const index = +event.returnValues.index;
        this.loadPayments(index, 1);
        this.loadBalance();
      })
      .on('error', console.log);
    this.contract.events.PaymentUpdated()
      .on('data', (event: any) => {
        const index = +event.returnValues.index;
        this.loadPayments(index, 1);
        this.loadBalance();
      })
      .on('error', console.log);
  }

  async loadBalance() {
    this.balance = await web3.eth.getBalance(this.contract._address);
  }

  /**
   * Load count payments from offset
   **/
  async loadPayments(index: number, count: number) {
    this.paymentCount = +(await this.contract.methods.paymentCount().call());
    if (this.paymentCount === 0) {
      this.payments = [];
      return;
    }
    if (index >= this.paymentCount) {
      throw new Error(`Invalid index supplied`);
    }
    const promises = [];
    for (let x = index; x < index + count; x++) {
      if (x >= this.paymentCount) break;
      const promise = this.contract.methods.payments(x).call()
        .then((payment: Payment) => {
          payment.index = x;
          return new Payment(payment);
        });
      promises.push(promise);
    }
    const loadedIndexes: {
      [key: number]: boolean
    } = {};
    // Put the newly loaded  payments in front of the others then uniq and sort
    this.payments = [...(await Promise.all(promises)), ...this.payments]
      .filter((payment: Payment) => {
        if (loadedIndexes[payment.index]) return false;
        loadedIndexes[payment.index] = true;
        return loadedIndexes;
      })
      .sort((p1: Payment, p2: Payment) => {
        return p2.index - p1.index;
      })
      .reverse();
  }

  async paymentCreate(
    from: string,
    to: string,
    time: number|string,
    weiValue: string|number
  ) {
    return await this.contract.methods.paymentCreate(to, time).send({
      from,
      value: weiValue,
      gas: 300000
    });
  }

  async paymentSettle(from: string, index: number) {
    await this.contract.methods.paymentSettle(index).send({
      from,
      gas: 300000
    });
  }

  async paymentFork(from: string, index: number, receiver: string, weiValue: string|BN) {
    await this.contract.methods.paymentFork(index, receiver, weiValue).send({
      from,
      gas: 500000
    });
    await this.loadPayments(index, 1);
  }

  async payment(index: number): Promise<Payment> {
    return new Payment(await this.contract.methods.payments(index).call());
  }

  async paymentWeiOwed(index: number) {
    return await this.contract.methods.paymentWeiOwed(index).call();
  }

  async loadPaymentCount() {
    const _paymentCount = +(await this.contract.methods.paymentCount().call());
    this.paymentCount = _paymentCount;
  }

  addressForNetwork(networkId: number): string {
    if (networkId === 1) {
      return '0x9e27fc3d1626f91c926e4126954d27c053dd8fc0';
    } else if (networkId === 3) {
      return '0x15a11132c71fec511847ec067c41cda255793c67';
    } else if (networkId === 4) {
      return '0x542a33465fc38e537b5e8f89d277b88fae8cd14a';
    } else {
      throw new Error(`Invalid networkId: ${networkId} supplied to addressForNetwork`);
    }
  }
}
