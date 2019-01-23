import React from 'react';
import { Payment } from '../stores/Syndicate';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import WeiDisplay from './WeiDisplay';
import AddressField from './AddressField';
import SyndicateStore from '../stores/Syndicate';
import WeiField from './WeiField';

const Container = styled.div`
  background-color: #EEE;
`;

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
  shouldComponentUpdate() {
    return true;
  }

  render() {
    if (this.props.payment.settled) return null;
    // Temporarily show forking logic for all users
    // if (this.props.payment.receiver !== this.props.ethereumStore.activeAddress) return null;
    return (
      <Container>
        Max Forkable Value: <WeiDisplay wei={+this.props.payment.weiValue - +this.props.payment.weiPaid} />
        <br />
        Fork to address:
        <AddressField
          onChange={toAddress => this.setState({ toAddress })}
          address={this.state.toAddress}
        />
        <br />
        Amount:
        <WeiField onChange={weiValue => this.setState({ weiValue })} />
        <WeiDisplay wei={this.state.weiValue} />
        <br />
        <button type="button" onClick={() => {
          this.props.syndicateStore.paymentFork(
            this.props.ethereumStore.activeAddress,
            this.props.payment.index,
            this.state.toAddress,
            this.state.weiValue
          );
        }}>Fork Payment</button>
      </Container>
    );
  }
}
