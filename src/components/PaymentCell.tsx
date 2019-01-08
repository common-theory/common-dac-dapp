import React from 'react';
import { inject, observer } from 'mobx-react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import SyndicateStore, { Payment } from '../stores/Syndicate';
import EthereumStore from '../stores/Ethereum';

const TextSpan = styled.span`
  margin-left: 4px;
  margin-right: 4px;
`;

@inject('syndicateStore', 'ethereumStore')
@observer
export default class PaymentCell extends React.Component <{
  payment: Payment,
  ethereumStore?: EthereumStore,
  syndicateStore?: SyndicateStore
}> {
  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          <TextSpan>Payment - {this.props.payment.receiver}</TextSpan>
        </BlockHeader>
        <BlockElement>
          Sender: {this.props.payment.sender}
          <br />
          Receiver: {this.props.payment.receiver}
          <br />
          WeiValue: {this.props.payment.weiValue}
          <br />
          WeiPaid: {this.props.payment.weiPaid}
          <br />
          <button type="button" onClick={() => {
            this.props.syndicateStore.settlePayment(
              this.props.ethereumStore.activeAddress,
              1 // TODO replace with number
            );
          }}>Settle</button>
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
