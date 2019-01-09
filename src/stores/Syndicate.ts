import { observable } from 'mobx';
import BN from 'bn.js';
import ABI from './SyndicateABI';

export interface Payment {
  index: number;
  sender: string;
  receiver: string;
  timestamp: string|number|BN;
  time: string|number|BN;
  weiValue: string|number|BN;
  weiPaid: string|number|BN;
}

export default class SyndicateStore {

  private contract: any;
  @observable payments: Payment[] = [];
  @observable paymentCount: number = 0;
  @observable balances: {
    [key: string]: string
  } = {};

  constructor(networkId: number) {
    this.reloadContract(networkId);
  }

  reloadContract(networkId: number) {
    this.contract = new web3.eth.Contract(ABI, this.addressForNetwork(networkId));
    this.payments = [];
    this.paymentCount = 0;
    this.balances = {};
    this.loadPayments(0, 10);
    this.contract.events.PaymentCreated()
      .on('data', (event: any) => {
        const index = +event.returnValues.index;
        this.loadPayments(index, 1);
      })
      .on('error', console.log);
    this.contract.events.PaymentUpdated()
      .on('data', (event: any) => {
        const index = +event.returnValues.index;
        this.loadPayments(index, 1);
      })
      .on('error', console.log);
  }

  /**
   * Calculate the paymentWeiOwed at the current point in time using only local
   * data
   **/
  static paymentWeiOwed(payment: Payment) {
    if (isNaN(+payment.weiValue) || isNaN(+payment.timestamp) || isNaN(+payment.time) || isNaN(+payment.weiPaid)) return 0;
    if (+payment.time === 0) return 0;
    if (+payment.weiValue === 0) return 0;
    const now = Math.floor(+new Date() / 1000);
    const weiValue = new BN(payment.weiValue);
    const weiPaid = new BN(payment.weiPaid);
    const timeOffset = new BN(Math.min(now - +payment.timestamp, +payment.time));
    return weiValue.mul(timeOffset).div(new BN(payment.time)).sub(weiPaid);
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
          return payment;
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

  async loadBalance(address: string) {
    const balance = await this.contract.methods.balances(address).call();
    this.balances[address] = balance;
  }

  async deposit(
    from: string,
    to: string,
    time: number|string,
    weiValue: string|number
  ) {
    return await this.contract.methods.deposit(to, time).send({
      from,
      value: weiValue,
      gas: 300000
    });
  }

  async settlePayment(from: string, index: number) {
    await this.contract.methods.paymentSettle(index).send({
      from,
      gas: 300000
    });
  }

  async withdraw(from: string) {
    await this.contract.methods.withdraw().send({
      from,
      gas: 300000
    });
  }

  async payment(index: number): Promise<Payment> {
    return await this.contract.methods.payments(index).call() as Payment;
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
      return '';
    } else if (networkId === 4) {
      return '0x1ad19921a4029dcbe0e698892378d763bb01dc38';
    } else {
      throw new Error(`Invalid networkId: ${networkId} supplied to addressForNetwork`);
    }
  }
}
