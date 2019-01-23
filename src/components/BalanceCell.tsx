import React from 'react';
import { VFlex, InternalCell, BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import { observer, inject } from 'mobx-react';
import SyndicateStore from '../stores/Syndicate';
import WeiDisplay from './WeiDisplay';

@inject('syndicateStore')
@observer
export default class BalanceCell extends React.Component<{
  address: string,
  syndicateStore?: SyndicateStore
}> {

  componentDidMount() {
    if (this.props.address) {
      this.props.syndicateStore.loadBalance(this.props.address);
    }
  }

  componentDidUpdate(oldProps: { address: string }) {
    if (oldProps.address !== this.props.address) {
      this.props.syndicateStore.loadBalance(this.props.address);
    }
  }

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          My Balance
        </BlockHeader>
        <BlockElement>
          <InternalCell>
            <VFlex>
              <WeiDisplay wei={this.props.syndicateStore.balances[this.props.address] || '0'} />
              <button type="button" onClick={() => {
                this.props.syndicateStore.withdraw(this.props.address);
              }}>Withdraw</button>
            </VFlex>
          </InternalCell>
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
