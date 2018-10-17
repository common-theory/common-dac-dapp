import Web3 from 'web3';
import { observable, action } from 'mobx';

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.200:8545"));
}

export default class AppStore {

  @observable networkId: number = -1;

  @observable commonDacContract: any = web3.eth.Contract(require('../contracts/CommonDAC.abi.json'), '0x41c51d39498f21f780dc94cae7359e2567b2b6f2');
  @observable dacVotingMembers: number = 0;
  @observable dacTotalOwnership: number = 0;
  @observable dacVotingCycle: number = 0;
  @observable dacGenesisBlockTimestamp: number = 0;
  @observable dacContractUpdated: boolean = false;
  @observable dacActiveProposalCount: number = 0;

  @action
  async loadNetworkId() {
    this.networkId = await web3.eth.net.getId();
  }

  @action
  async loadDacInfo() {
    this.commonDacContract.methods.call({
      from: ''
    })
  }
}
