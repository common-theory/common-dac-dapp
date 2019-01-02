import React from 'react';
import { BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import { observer, inject } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import Colors from './Colors';
import Members from './Members';

@inject('ethereumStore')
@observer
export default class ContractInfo extends React.Component <{ ethereumStore?: EthereumStore }> {
  timeout: NodeJS.Timeout;
  state = {
    // cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
  };

  componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState({
        // cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    // const contractAddress = this.props.dacStore.addressForNetworkId(this.props.ethStore.networkId);
    const contractAddress = '';
    return (
      <BlockContainer>
        <BlockHeader>
          Contract Information
        </BlockHeader>
        <BlockElement>
          <p style={{
            margin: 16
          }}>
            Ethereum sent to the address below is distributed proportionately to the addresses with value.
          </p>
          <div style={{ textAlign: 'center' }}>
            <div>
              Contract Address
            </div>
            <div style={{
              display: 'inline-block',
              backgroundColor: Colors.black(0.7),
              borderRadius: 20,
              margin: 8,
              padding: 12,
              textAlign: 'center'
            }}>
              <a style={{
                color: '#fff',
                fontFamily: 'helvetica',
                fontWeight: 600,
                fontSize: 16
              }} href={this.props.ethereumStore.etherscanUrl(contractAddress)} target="_blank">
                {contractAddress}
              </a>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
            <div>
            {
              // <div>
              //   Total Members: {this.props.dacStore.totalVotingMembers}
              // </div>
              // <div>
              //   Total Value: {this.props.dacStore.totalValue}
              // </div>
              // <div>
              //   Current Vote Cycle: {this.props.dacStore.currentVoteCycle}
              // </div>
              // <div>
              //   Cycle Time Remaining: {this.state.cycleTimeRemaining} seconds
              // </div>
              // <div>
              //   Proposal Count: {this.props.dacStore.proposalCount}
              // </div>
            }
            </div>
            <Members />
          </div>
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
