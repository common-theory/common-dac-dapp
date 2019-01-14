import React from 'react';
import { inject, observer } from 'mobx-react';
import { HFlex, BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import SyndicateStore, { Payment } from '../stores/Syndicate';
import EthereumStore from '../stores/Ethereum';
import TimerDisplay from './TimerDisplay';
import ForkControls from './ForkControls';
import PaymentInfo from './PaymentInfo';
import PaymentGraph from './PaymentGraph';

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
    return (
      <BlockContainer>
        <BlockHeader>
          <TextSpan>Payment {this.props.payment.index} - {this.props.payment.settled ? 'settled' : `${TimerDisplay.formatSeconds(this.props.payment.timeRemaining)} remaining`}</TextSpan>
        </BlockHeader>
        <BlockElement>
          <PaymentInfo payment={this.props.payment} />
          <ForkControls payment={this.props.payment} />
          {
            this.props.payment.isForked && !this.props.payment.isFork ? (
              <PaymentGraph payment={this.props.payment} />
            ) : null
          }
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
