import { observable, action } from 'mobx';

export default class EthereumStore {

  private blockHeaderSubscription: any;
  @observable currentBlockHeader?: BlockHeader;
  @observable receivedBlockHeaders: BlockHeader[] = [];

  @observable currentBlockNumber: number = 0;

  @observable activeAddress: string;
  @observable networkId: number = 1;

  constructor() {
    this.blockHeaderSubscription = web3.eth.subscribe('newBlockHeaders');
    this.blockHeaderSubscription.on('data', (blockHeader: BlockHeader) => {
      this.currentBlockHeader = blockHeader;
      this.receivedBlockHeaders.push(blockHeader);
      this.currentBlockNumber = blockHeader.number;
    });
    this.blockHeaderSubscription.on('error', console.error);
    this.loadBlock();
    this.loadNetworkId();
    this.loadActiveAccount();
  }

  etherscanUrl(_address?: string): string {
    const address = _address || this.activeAddress;
    if (this.networkId === 1) {
      // mainnet
      return `https://etherscan.io/address/${address}`;
    } else if (this.networkId === 4) {
      return `https://rinkeby.etherscan.io/address/${address}`;
    } else {
      return `https://etherscan.io/address/${address}`;
    }
  }

  assertAuthenticated() {
    if (this.authenticated()) return;
    alert('Login with Metamask to do that.');
    throw new Error('Metamask unauthenticated');
  }

  authenticated(): boolean {
    return !!this.activeAddress;
  }

  async loadActiveAccount() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      this.activeAddress = accounts[0];
      return this.activeAddress;
    } else {
      this.activeAddress = undefined;
      return;
    }
  }

  @action
  async loadNetworkId() {
    this.networkId = await web3.eth.net.getId();
  }

  @action
  async loadBlock() {
    await this.loadBlockNumber();
    this.currentBlockHeader = await web3.eth.getBlock(this.currentBlockNumber);
  }

  @action
  async loadBlockNumber() {
    this.currentBlockNumber = await web3.eth.getBlockNumber();
  }
}
