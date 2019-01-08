import { observable, action } from 'mobx';

export default class EthereumStore {

  private blockHeaderSubscription: any;
  @observable currentBlockHeader?: BlockHeader;
  @observable receivedBlockHeaders: BlockHeader[] = [];

  @observable currentBlockNumber: number = 0;

  @observable accounts: any[] = [];
  @observable private _networkId: number = -1;

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

  etherscanUrl(_address?: string): string {
    const address = _address || this.activeAddress();
    if (this.networkId === 1) {
      // mainnet
      return `https://etherscan.io/address/${address}`;
    } else if (this.networkId === 4) {
      return `https://rinkeby.etherscan.io/address/${address}`;
    } else {
      return `https://etherscan.io/address/${address}`;
    }
  }

  activeAddress() {
    return this.accounts.length && this.accounts[0];
  }

  async loadAccounts() {
    this.accounts = await web3.eth.getAccounts();
  }

  @action
  async loadNetworkId() {
    this._networkId = await web3.eth.net.getId();
  }

  /**
   * Get the current loaded networkId, this value may be stale.
   **/
  get networkId() {
    return this._networkId;
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