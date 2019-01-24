import React from 'react';
import { InternalCell, HLine, VFlex, BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import { observer, inject } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import SyndicateStore from '../stores/Syndicate';

@inject('ethereumStore', 'syndicateStore')
@observer
export default class ContractInfo extends React.Component <{
  ethereumStore?: EthereumStore,
  syndicateStore?: SyndicateStore
}> {

  componentDidMount() {
    if (this.props.ethereumStore.authenticated()) {
      this.props.syndicateStore.loadBalance(this.props.ethereumStore.activeAddress);
    }
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
          <VFlex>
            <InternalCell>
              <VFlex>
                Contract Address
                <HLine />
                <a style={{
                  color: '#000',
                  fontFamily: 'helvetica',
                  fontWeight: 600,
                  fontSize: 16
                }} href={this.props.ethereumStore.etherscanUrl(contractAddress)} target="_blank">
                  {contractAddress}
                </a>
              </VFlex>
            </InternalCell>
          </VFlex>
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
