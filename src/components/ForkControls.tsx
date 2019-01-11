import React from 'react';
import { Payment } from '../stores/Syndicate';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';

const Container = styled.div`
  background-color: #EEE;
`;

@inject('ethereumStore')
@observer
export default class ForkControls extends React.Component <{
  payment: Payment,
  ethereumStore?: EthereumStore
}> {
  render() {
    const paymentSettled = this.props.payment.weiPaid === this.props.payment.weiValue;
    if (paymentSettled) return null;
    if (this.props.payment.receiver !== this.props.ethereumStore.activeAddress) return null;
    return (
      <Container>
        <button type="button" onClick={() => {
          console.log('fork');
        }}>Fork Payment</button>
      </Container>
    );
  }
}
