import { observable } from 'mobx';

interface Member {
  ownership: number,
  link: string,
}

export interface Proposal {
  number: number,
  description: string,
  creator: string,
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
  @observable totalValue: number = 0;

  @observable currentVoteCycle: number = 0;
  @observable contractUpdated: boolean = false;

  // The voting period in seconds
  @observable votePeriod: number = 0;
  // The timestamp of contract creation
  @observable genesisBlockTimestamp: number = 0;

  @observable proposals: Proposal[] = [];
  @observable proposalCount: number = 0;
  @observable memberAddresses: string[] = [];
  @observable memberAddressCount: number = 0;
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
      this.loadMembers();
      this.blockHeaderSubscription = web3.eth.subscribe('newBlockHeaders');
      this.blockHeaderSubscription.on('data', () => this.load());
      this.blockHeaderSubscription.on('error', console.error);
    });
  }

  async loadMember(address: string) {
    this.members[address] = await this.contract.methods.members(address).call();
  }

  async loadMembers() {
    await this.loadMemberAddresses();
    await Promise.all(this.memberAddresses.map(address => this.loadMember(address)));
  }

  async loadMemberAddresses() {
    this.memberAddressCount = await this.contract.methods.memberAddressCount().call();
    if (this.memberAddressCount === 0) {
      this.memberAddresses = [];
      return;
    }
    const promiseArr = [];
    for (let x = 0; x < this.memberAddressCount; x++) {
      promiseArr.push(this.contract.methods.memberAddresses(x).call());
    }
    this.memberAddresses = await Promise.all(promiseArr) as string[];
  }

  async createProposal(config: {
    description: string,
    updateMember: boolean,
    memberAddress: string,
    newValue: number,
    newContractAddress: string,
    updateContract: boolean
  }) {
    const accounts = await web3.eth.getAccounts();
    if (!accounts.length) return;
    this.contract.methods.createProposal(
      config.description,
      config.updateMember,
      config.memberAddress || '0x0',
      config.newValue,
      config.newContractAddress || '0x8dFFB6953C969913887ceE6ba20a22f9BdB4b94d',
      config.updateContract
    ).send({
      from: accounts[0]
    });
  }

  async voteForProposal(id: number, accept: boolean) {
    const accounts = await web3.eth.getAccounts();
    if (!accounts.length) return;
    await this.contract.methods.vote(id, accept).send({
      from: accounts[0]
    });
  }

  addressForNetworkId(id: number) {
    if (id === 1) {
      return '0xA1FA6c74E704506AeAB57C8b1335336E213c0442';
    } else if (id === 4) {
      return '0xc984e6a196408dbaceb8b5e598badced2b3da412';
    } else if (id === 5777) {
      // ganache <3
      return '0x83c19928eb2893bf3f11099bf13e71cab32d13f0';
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
      _totalValue,
      _contractUpdated,
      _votePeriod,
      _genesisBlockTimestamp
    ] = await Promise.all([
      this.contract.methods.totalVotingMembers().call(),
      this.contract.methods.totalValue().call(),
      this.contract.methods.contractUpdated().call(),
      this.contract.methods.votePeriod().call(),
      this.contract.methods.genesisBlockTimestamp().call(),
      this.loadCurrentVoteCycle(),
      this.loadProposals()
    ]);
    this.totalVotingMembers = _totalVotingMembers;
    this.totalValue = _totalValue;
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
