import { observable } from 'mobx';
import BN from 'bn.js';

const ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "payments",
    "outputs": [
      {
        "name": "sender",
        "type": "address"
      },
      {
        "name": "receiver",
        "type": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "name": "time",
        "type": "uint256"
      },
      {
        "name": "weiValue",
        "type": "uint256"
      },
      {
        "name": "weiPaid",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "PaymentUpdated",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_receiver",
        "type": "address"
      },
      {
        "name": "_time",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_receiver",
        "type": "address"
      },
      {
        "name": "_weiValue",
        "type": "uint256"
      },
      {
        "name": "_time",
        "type": "uint256"
      },
      {
        "name": "_sender",
        "type": "address"
      }
    ],
    "name": "pay",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "paymentSettle",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "paymentWeiOwed",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "isPaymentSettled",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "assertPaymentIndexInRange",
    "outputs": [],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "weiValue",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "weiValue",
        "type": "uint256"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "indexesToSettle",
        "type": "uint256[]"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "weiValue",
        "type": "uint256"
      },
      {
        "name": "to",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "paymentCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

export interface Payment {
  id: number|BN;
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

  constructor() {
    this.contract = new web3.eth.Contract(ABI, this.addressForNetwork(0));
    this.loadPayments();
  }

  async loadPayments() {
    this.paymentCount = await this.contract.methods.paymentCount().call();
    if (+this.paymentCount === 0) {
      this.payments = [];
      return;
    }
    const promises = [];
    for (let x = 0; x < Math.min(this.paymentCount, 10); x++) {
      promises.push(this.contract.methods.payments(x).call());
    }
    this.payments = await Promise.all(promises);
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

  addressForNetwork(__networkId: number): string {
    return '0x8280c8b56c0270e40ffed3867d81789e0712f976';
  }
}
