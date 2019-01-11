import React from 'react';
import { Payment } from '../stores/Syndicate';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import WeiDisplay from './WeiDisplay';
import AddressField from './AddressField';
import web3 from 'web3';
import SyndicateStore from '../stores/Syndicate';

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
    amount: '0'
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
        Max Forkable Value: <WeiDisplay wei={+this.props.payment.weiValue - +this.props.payment.weiOwed} />
        <br />
        Fork to address:
        <AddressField
          onChange={toAddress => this.setState({ toAddress })}
          address={this.state.toAddress}
        />
        <br />
        Amount:
        <input
          type="number"
          name="amount"
          step="any"
          min="0"
          onChange={event => this.setState({
            amount: event.target.value.toString() || '0'
          })}
          value={this.state.amount}
        />
        <WeiDisplay wei={web3.utils.toWei(this.state.amount.toString())} />
        <br />
        <button type="button" onClick={() => {
          this.props.syndicateStore.paymentFork(
            this.props.ethereumStore.activeAddress,
            this.props.payment.index,
            this.state.toAddress,
            web3.utils.toWei(this.state.amount.toString())
          );
        }}>Fork Payment</button>
      </Container>
    );
  }
}
