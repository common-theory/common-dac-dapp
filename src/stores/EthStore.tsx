import { observable, action } from 'mobx';

export default class EthStore {

  @observable networkId: number = -1;

  private blockHeaderSubscription: any;
  @observable currentBlockHeader?: BlockHeader;
  @observable receivedBlockHeaders: BlockHeader[] = [];

  @observable currentBlockNumber: number = 0;

  @observable accounts: any[] = [];

  constructor() {
    this.blockHeaderSubscription = web3.eth.subscribe('newBlockHeaders');
    this.blockHeaderSubscription.on('data', (blockHeader: BlockHeader) => {
      this.currentBlockHeader = blockHeader;
      this.receivedBlockHeaders.push(blockHeader);
      this.currentBlockNumber = blockHeader.number;
    });
    this.blockHeaderSubscription.on('error', console.error);
    this.loadNetworkId();
    this.loadBlock();
    this.loadAccounts();
  }

  etherscanUrl(address: string = this.accounts[0]): string {
    if (this.networkId === 1) {
      // mainnet
      return `https://etherscan.io/address/${address}`;
    } else if (this.networkId === 4) {
      return `https://rinkeby.etherscan.io/address/${address}`;
    } else {
      return `https://etherscan.io/address/${address}`;
    }
  }

  async loadAccounts() {
    this.accounts = await web3.eth.getAccounts();
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
