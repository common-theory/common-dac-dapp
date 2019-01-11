import React from 'react';
import { Payment } from '../stores/Syndicate';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import WeiDisplay from './WeiDisplay';
import AddressField from './AddressField';

const Container = styled.div`
  background-color: #EEE;
`;

@inject('ethereumStore')
@observer
export default class ForkControls extends React.Component <{
  payment: Payment,
  ethereumStore?: EthereumStore
}> {
  state = {
    toAddress: ''
  };
  shouldComponentUpdate() {
    return true;
  }

  render() {
    if (this.props.payment.settled) return null;
    if (this.props.payment.receiver !== this.props.ethereumStore.activeAddress) return null;
    return (
      <Container>
        Max Forkable Value: <WeiDisplay wei={+this.props.payment.weiValue - +this.props.payment.weiOwed} />
        <br />
        Fork to address: <AddressField onChange={toAddress => this.setState({ toAddress })} address={this.state.toAddress} />
        <button type="button" onClick={() => {
          console.log('fork');
        }}>Fork Payment</button>
      </Container>
    );
  }
}
