import React from 'react';
import { inject, observer } from 'mobx-react';
import { ClockIcon, CheckIcon, HFlex, VFlex, BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import SyndicateStore, { Payment } from '../stores/Syndicate';
import EthereumStore from '../stores/Ethereum';
import TimerDisplay from './TimerDisplay';
import ForkControls from './ForkControls';
import PaymentInfo from './PaymentInfo';
import Colors from './Colors';

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

  renderForked = () => {
    return `Forked to payments ${this.props.payment.fork1Index} and ${this.props.payment.fork2Index}.`;
  };

  renderUnforked = () => {
    return (
      <HFlex>
        <VFlex>
          <PaymentInfo payment={this.props.payment} />
        </VFlex>
        <VFlex>
          <ForkControls payment={this.props.payment} />
        </VFlex>
      </HFlex>
    );
  };

  renderHeaderText = () => {
    if (this.props.payment.settled) {
      return (
        <HFlex>
          <CheckIcon style={{
            fill: Colors.green,
            width: 30,
            height: 30
          }} />
          <TextSpan>Payment {this.props.payment.index}</TextSpan>
          <TextSpan>Completed</TextSpan>
        </HFlex>
      );
    }
    return (
      <HFlex>
        <ClockIcon style={{
          fill: Colors.blue,
          height: 30,
          width: 30
        }} />
        <TextSpan>Payment {this.props.payment.index} - {`${TimerDisplay.formatSeconds(this.props.payment.timeRemaining)} remaining`}</TextSpan>
      </HFlex>
    );
  };

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          {this.renderHeaderText()}
        </BlockHeader>
        <BlockElement>
          {
            this.props.payment.isForked
            ?
            this.renderForked()
            :
            this.renderUnforked()
          }
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
