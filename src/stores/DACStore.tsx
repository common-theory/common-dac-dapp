import { observable, action } from 'mobx';

interface Member {
  ownership: number,
  name: string,
  github: string,
  website: string
}

export interface Proposal {
  number: number,
  voteCycle: number,
  updateMember: boolean,
  memberAddress: string,
  newOwnership: number,
  newContractAddress: string,
  updateContract: boolean
  totalAcceptingVotes: number,
  totalRejectingVotes: number,
  applied: boolean
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

  @observable proposals: Proposal[] = [];
  @observable proposalCount: number = 0;
  @observable members: {
    [address: string]: Member
  } = {};

  constructor() {
    let ABI: any;
    try {
      ABI = require('../../CommonDAC.abi.json');
    } catch (err) {
      console.log('Error loading contract ABI, ensure that it\'s present');
      throw err;
    }
    web3.eth.net.getId().then((id: number) => {
      this.contract = new web3.eth.Contract(ABI, this.addressForNetworkId(id));
      this.load();
      this.blockHeaderSubscription = web3.eth.subscribe('newBlockHeaders');
      this.blockHeaderSubscription.on('data', () => this.load());
      this.blockHeaderSubscription.on('error', console.error);
    });
  }

  async loadMember(address: string) {
    this.members[address] = await this.contract.methods.members(address).call();
  }

  async createProposal(config: {
    updateMember: boolean,
    memberAddress: string,
    newOwnership: number,
    newContractAddress: string,
    updateContract: boolean
  }) {
    const accounts = await web3.eth.getAccounts();
    if (!accounts.length) return;
    this.contract.methods.createProposal(
      config.updateMember,
      config.memberAddress || '0x0',
      config.newOwnership,
      config.newContractAddress || '0x8dFFB6953C969913887ceE6ba20a22f9BdB4b94d',
      config.updateContract
    ).send({
      from: accounts[0]
    });
  }

  addressForNetworkId(id: number) {
    if (id === 1) {
    } else if (id === 4) {
      return '0x8dFFB6953C969913887ceE6ba20a22f9BdB4b94d';
    } else if (id === 5777) {
      // ganache <3
      return '0x26ab7a9fb21a55035de62650b62f80fb03337555';
    }
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
      this.loadProposals()
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

  async loadProposals() {
    this.proposalCount = await this.contract.methods.proposalCount().call();
    if (this.proposalCount === 0) {
      this.proposals = [];
      return;
    }
    const promiseArr = [];
    for (let x = 0; x < this.proposalCount; x++) {
      promiseArr.push(this.loadProposal(x));
    }
    this.proposals = await Promise.all(promiseArr) as Proposal[];
  }

  async loadProposal(index: number) {
    return await this.contract.methods.proposals(index).call();
  }

}
