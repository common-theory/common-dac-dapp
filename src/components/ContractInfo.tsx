import React from 'react';
import { BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import { observer, inject } from 'mobx-react';
import DACStore from '../stores/DACStore';
import Members from './Members';

@inject('dacStore', 'ethStore')
@observer
export default class ContractInfo extends React.Component <{ dacStore?: DACStore }> {
  timeout: NodeJS.Timeout;
  state = {
    cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
  };

  componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState({
        cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    const contractAddress = this.props.dacStore.addressForNetworkId(this.props.ethStore.networkId);
    return (
      <BlockContainer>
        <BlockHeader>
          Contract Information
        </BlockHeader>
        <BlockElement>
          <Members />
          <p>
            A contract for routing incoming funds. Ethereum sent to the address below is distributed proportionately to the addresses with value.
          </p>
          <div>
            {'Address: '}
            <a href={this.props.ethStore.etherscanUrl(contractAddress)} target="_blank">
              {contractAddress}
            </a>
          </div>
          <div>
            Total Members: {this.props.dacStore.totalVotingMembers}
          </div>
          <div>
            Total Value: {this.props.dacStore.totalValue}
          </div>
          <div>
            Current Vote Cycle: {this.props.dacStore.currentVoteCycle}
          </div>
          <div>
            Cycle Time Remaining: {this.state.cycleTimeRemaining} seconds
          </div>
          <div>
            Proposal Count: {this.props.dacStore.proposalCount}
          </div>
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
