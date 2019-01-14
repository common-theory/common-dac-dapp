import React from 'react';
import { BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import { observer, inject } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import SyndicateStore from '../stores/Syndicate';
import Colors from './Colors';

@inject('ethereumStore', 'syndicateStore')
@observer
export default class ContractInfo extends React.Component <{
  ethereumStore?: EthereumStore,
  syndicateStore?: SyndicateStore
}> {

  componentDidMount() {
    this.props.syndicateStore.loadBalance(this.props.ethereumStore.activeAddress);
  }

  render() {
    const contractAddress = this.props.syndicateStore.addressForNetwork(this.props.ethereumStore.networkId);
    return (
      <BlockContainer>
        <BlockHeader>
          Contract Information
        </BlockHeader>
        <BlockElement>
          <p style={{
            margin: 16
          }}>
            Common Theory allows Ether to be paid to addresses over time. Ether sent is guaranteed to be paid and can be withdrawn with 1 second resolution.
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
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
