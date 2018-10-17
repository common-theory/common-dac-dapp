import { observable, action } from 'mobx';

interface Member {
  ownership: number,
  name: string,
  github: string,
  website: string
}

export default class DACStore {

  private blockHeaderSubscription: any;
  private contract: any;
  @observable totalVotingMembers: number = 0;
  @observable totalOwnership: number = 0;

  @observable currentVoteCycle: number = 0;
  @observable contractUpdated: boolean = false;

  // The voting period in seconds
  @observable votePeriod: number = 0;
  // The timestamp of contract creation
  @observable genesisBlockTimestamp: number = 0;

  constructor() {
    let ABI;
    try {
      ABI = require('../../CommonDAC.abi.json');
    } catch (err) {
      console.log('Error loading contract ABI, ensure that it\'s present');
      throw err;
    }
    this.contract = new web3.eth.Contract(ABI, '0x265369a96693b47b28645ec2cb34c15d52b1d190');
    this.load();
    this.blockHeaderSubscription = web3.eth.subscribe('newBlockHeaders');
    this.blockHeaderSubscription.on('data', () => this.load());
    this.blockHeaderSubscription.on('error', console.error);
  }

  /**
   * Returns the number of seconds remaining in the current voting cycle.
   **/
  cycleTimeRemaining(): number {
    const nowSeconds = +(new Date()) / 1000;
    return Math.floor(
      this.votePeriod - ((nowSeconds - this.genesisBlockTimestamp) % this.votePeriod)
    );
  }

  async load() {
    const [
      _totalVotingMembers,
      _totalOwnership,
      _contractUpdated,
      _votePeriod,
      _genesisBlockTimestamp
    ] = await Promise.all([
      this.contract.methods.totalVotingMembers().call(),
      this.contract.methods.totalOwnership().call(),
      this.contract.methods.contractUpdated().call(),
      this.contract.methods.votePeriod().call(),
      this.contract.methods.genesisBlockTimestamp().call(),
      this.loadCurrentVoteCycle(),
    ]);
    this.totalVotingMembers = _totalVotingMembers;
    this.totalOwnership = _totalOwnership;
    this.contractUpdated = _contractUpdated;
    this.votePeriod = _votePeriod;
    this.genesisBlockTimestamp = _genesisBlockTimestamp;
  }

  async loadCurrentVoteCycle() {
    this.currentVoteCycle = await this.contract.methods.currentVoteCycle().call();
  }

}
