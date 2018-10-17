import { observable, action } from 'mobx';

interface Member {
  ownership: number,
  name: string,
  github: string,
  website: string
}

export default class DACStore {

  private contract: any;
  @observable totalVotingMembers: number = 0;
  @observable totalOwnership: number = 0;

  @observable currentVoteCycle: number = 0;
  @observable contractUpdated: boolean = false;

  constructor() {
    this.contract = new web3.eth.Contract(require('./DAC.json'), '0xb01e10f5917d4a68e2b498ed61739d52fc97352a');
    this.loadVotingMembers();
    this.loadTotalOwnership();
    this.loadCurrentVoteCycle();
  }

  async loadVotingMembers() {
    this.totalVotingMembers = await this.contract.methods.totalVotingMembers().call();
  }

  async loadTotalOwnership() {
    this.totalOwnership = await this.contract.methods.totalOwnership().call();
  }

  async loadCurrentVoteCycle() {
    this.currentVoteCycle = await this.contract.methods.currentVoteCycle().call();
  }

}
