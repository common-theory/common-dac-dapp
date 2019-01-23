import React from 'react';
import { Payment } from '../stores/Syndicate';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import WeiDisplay from './WeiDisplay';
import AddressField from './AddressField';
import SyndicateStore from '../stores/Syndicate';
import WeiField from './WeiField';
import { GrayContainer } from './Shared';

@inject('ethereumStore', 'syndicateStore')
@observer
export default class ForkControls extends React.Component <{
  payment: Payment,
  ethereumStore?: EthereumStore,
  syndicateStore?: SyndicateStore
}> {
  state = {
    toAddress: '',
    weiValue: '0'
  };
  render() {
    return (
      <GrayContainer>
        Max Forkable Value: <WeiDisplay showUSD={false} wei={+this.props.payment.weiValue - +this.props.payment.weiPaid} />
        <br />
        Amount:
        <WeiField onChange={weiValue => this.setState({ weiValue })} />
        <WeiDisplay wei={this.state.weiValue} />
        <br />
        To:
        <AddressField
          onChange={toAddress => this.setState({ toAddress })}
          address={this.state.toAddress}
        />
        <br />
        <button type="button" onClick={() => {
          this.props.syndicateStore.paymentFork(
            this.props.ethereumStore.activeAddress,
            this.props.payment.index,
            this.state.toAddress,
            this.state.weiValue
          );
        }}>Fork Payment</button>
      </GrayContainer>
    );
  }
}
