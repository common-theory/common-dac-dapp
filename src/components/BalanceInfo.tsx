import React from 'react';
import { observer, inject } from 'mobx-react';
import SyndicateStore from '../stores/Syndicate';
import { BlockContainer, BlockElement, BlockFooter, BlockHeader } from './Shared';
import WeiDisplay from './WeiDisplay';
import EthereumStore from '../stores/Ethereum';

@inject('syndicateStore', 'ethereumStore')
@observer
export default class BalanceInfo extends React.Component<{
  syndicateStore?: SyndicateStore,
  ethereumStore?: EthereumStore
}> {
  componentDidMount() {
    this.props.syndicateStore.loadBalance(this.props.ethereumStore.activeAddress);
  }

  render() {
    console.log(this.props.syndicateStore.balances['0xddeC6C333538fCD3de7cfB56D6beed7Fd8dEE604']);
    return (
      <BlockContainer>
        <BlockHeader>
          Your Balance
        </BlockHeader>
        <BlockElement>
          Available: <WeiDisplay wei={this.props.syndicateStore.balances[this.props.ethereumStore.activeAddress]} />
          <br />
          <button onClick={() => {
            this.props.syndicateStore.withdraw(this.props.ethereumStore.activeAddress);
          }}>withdraw</button>
          <br />
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
