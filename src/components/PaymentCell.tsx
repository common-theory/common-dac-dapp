import React from 'react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import { Payment } from '../stores/Syndicate';

const TextSpan = styled.span`
  margin-left: 4px;
  margin-right: 4px;
`;

export default class PaymentCell extends React.Component <{
  payment: Payment
}> {
  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          <TextSpan>Payment - {this.props.payment.receiver}</TextSpan>
        </BlockHeader>
        <BlockElement>
          Test
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
