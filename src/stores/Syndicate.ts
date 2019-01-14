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
  parentIndex: number;
  isForked: boolean;
  fork1Index: number;
  fork2Index: number;

  constructor(obj: any, index: number) {
    if (isNaN(+index)) throw new Error('Nan index received for Payment');
    this.index = +index;
    this.sender = obj.sender;
    this.receiver = obj.receiver;
    this.timestamp = obj.timestamp;
    this.time = obj.time;
    this.weiValue = obj.weiValue;
    this.weiPaid = obj.weiPaid;
    this.isFork = obj.isFork;
    this.parentIndex = obj.parentIndex;
    this.isForked = obj.isForked;
    this.fork1Index = obj.fork1Index;
    this.fork2Index = obj.fork2Index;
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
    this.loadAllPayments();
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
    this.contract.events.BalanceUpdated()
      .on('data', (event: any) => {
        const address = event.returnValues.target;
        this.loadBalance(address);
      })
      .on('error', console.log);
  }

  /**
   * Loads the payment binary tree into an array of payments
   **/
  async loadPaymentTree(rootIndex: number): Promise<Payment[]> {
    const indexes = await this.loadTreeIndexes(rootIndex);
    return await Promise.all(
      indexes.map((index: number|string) => this._cachedPayment(+index))
    );
  }

  /**
   * Loads the tree from the current point forward in time
   *
   * Recursively constructs array
   **/
  async loadTreeIndexes(rootIndex: number): Promise<number[]> {
    const payment = await this._cachedPayment(rootIndex);
    if (!payment.isForked) return [rootIndex];
    return [
      rootIndex,
      ...await this.loadTreeIndexes(payment.fork1Index),
      ...await this.loadTreeIndexes(payment.fork2Index)
    ];
  }

  async loadAllPayments() {
    await this.loadPaymentCount();
    await this.loadPayments(0, this.paymentCount);
  }

  /**
   * Load count payments from offset
   **/
  async loadPayments(index: number, count: number) {
    await this.loadPaymentCount();
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
          return new Payment(payment, x);
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
    const accounts = await web3.eth.getAccounts();
    await Promise.all(
      accounts.map((account: string) => this.loadBalance(account))
    );
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

  async paymentFork(from: string, index: number, receiver: string, weiValue: string|BN) {
    await this.contract.methods.paymentFork(index, receiver, weiValue).send({
      from,
      gas: 500000
    });
  }

  async withdraw(from: string) {
    await this.contract.methods.withdraw().send({
      from,
      gas: 300000
    });
  }

  async _cachedPayment(index: number) {
    if (this.payments[index]) return this.payments[index];
    return await this.payment(index);
  }

  async payment(index: number): Promise<Payment> {
    return new Payment(await this.contract.methods.payments(index).call(), index);
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
      return '0x992447bbd9d9e1d98deaa7d6237b3ebd0ced728e';
    } else if (networkId === 4) {
      return '0x5852ca0707d97418096ad073c9520fab37632c07';
    } else {
      throw new Error(`Invalid networkId: ${networkId} supplied to addressForNetwork`);
    }
  }
}
