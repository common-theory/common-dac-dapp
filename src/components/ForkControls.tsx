import React from 'react';
import { Payment } from '../stores/Syndicate';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import WeiDisplay from './WeiDisplay';
import AddressField from './AddressField';
import SyndicateStore from '../stores/Syndicate';
import WeiField from './WeiField';
import { InternalCell } from './Shared';
import Button from './Button';
import { HFlex, TextSpan } from './Shared';

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
      <InternalCell>
        <HFlex>
          <TextSpan>Max Forkable Value:</TextSpan>
          <WeiDisplay wei={+this.props.payment.weiValue - +this.props.payment.weiPaid} />
        </HFlex>
        <HFlex>
          <TextSpan>To:</TextSpan>
          <AddressField
            onChange={toAddress => this.setState({ toAddress })}
            address={this.state.toAddress}
          />
        </HFlex>
        <HFlex>
          <TextSpan>Amount:</TextSpan>
          <WeiField onChange={weiValue => this.setState({ weiValue })} />
          <WeiDisplay wei={this.state.weiValue} />
        </HFlex>
        {
          this.props.payment.settled ? null : (
            <Button onClick={() => {
              this.props.syndicateStore.paymentFork(
                this.props.ethereumStore.activeAddress,
                this.props.payment.index,
                this.state.toAddress,
                this.state.weiValue
              );
            }}>
              Fork Payment
            </Button>
          )
        }
      </InternalCell>
    );
  }
}
