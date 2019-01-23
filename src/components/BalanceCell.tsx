import React from 'react';
import { BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import { observer, inject } from 'mobx-react';
import SyndicateStore from '../stores/Syndicate';
import WeiDisplay from './WeiDisplay';

@inject('syndicateStore')
@observer
export default class BalanceCell extends React.Component<{
  address: string,
  syndicateStore?: SyndicateStore
}> {

  componentDidUpdate(oldProps: { address: string }) {
    if (oldProps.address !== this.props.address) {
      this.props.syndicateStore.loadBalance(this.props.address);
    }
  }

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          User Balance
        </BlockHeader>
        <BlockElement>
          <p>
            Your available contract balance. Payments to your address are settled to here.
          </p>
          <p>
            <WeiDisplay wei={this.props.syndicateStore.balances[this.props.address] || '0'} />
          </p>
          <button type="button" onClick={() => {
            this.props.syndicateStore.withdraw(this.props.address);
          }}>Withdraw</button>
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}