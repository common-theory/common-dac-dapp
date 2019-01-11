import React from 'react';
import { inject, observer } from 'mobx-react';
import { HFlex, BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import SyndicateStore, { Payment } from '../stores/Syndicate';
import EthereumStore from '../stores/Ethereum';
import TimerDisplay from './TimerDisplay';
import ForkControls from './ForkControls';
import PaymentInfo from './PaymentInfo';

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
  state = {};
  timer: any;
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(this.state);
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const paymentSettled = this.props.payment.weiPaid === this.props.payment.weiValue;
    const timeRemaining = Math.max(0, +this.props.payment.time - (Math.floor(+new Date() / 1000) - +this.props.payment.timestamp));
    return (
      <BlockContainer>
        <BlockHeader>
          <TextSpan>Payment {this.props.payment.index} - {paymentSettled ? 'settled' : `${TimerDisplay.formatSeconds(timeRemaining)} remaining`}</TextSpan>
        </BlockHeader>
        <BlockElement>
          <PaymentInfo payment={this.props.payment} />
          <ForkControls payment={this.props.payment} />
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
