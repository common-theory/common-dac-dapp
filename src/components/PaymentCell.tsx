import React from 'react';
import { inject, observer } from 'mobx-react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import SyndicateStore, { Payment } from '../stores/Syndicate';
import EthereumStore from '../stores/Ethereum';
import WeiDisplay from './WeiDisplay';
import TimerDisplay from './TimerDisplay';

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
    const totalWeiOwed = SyndicateStore.paymentWeiOwed(this.props.payment);
    const timeRemaining = +this.props.payment.time - (Math.floor(+new Date() / 1000) - +this.props.payment.timestamp);
    return (
      <BlockContainer>
        <BlockHeader>
          <TextSpan>Payment {this.props.payment.index} - {paymentSettled ? 'settled' : `${TimerDisplay.formatSeconds(timeRemaining)} remaining`}</TextSpan>
        </BlockHeader>
        <BlockElement>
          Sender: {this.props.payment.sender}
          <br />
          Receiver: {this.props.payment.receiver}
          <br />
          Time: {
            +this.props.payment.time === 0 ?
            'Instant' :
            <TimerDisplay seconds={+this.props.payment.time} />
          }
          <br />
          Total Value: <WeiDisplay wei={this.props.payment.weiValue} />
          <br />
          Total Paid: <WeiDisplay wei={this.props.payment.weiPaid} />
          <br />
          Total Available: <WeiDisplay wei={totalWeiOwed} />
          {(() => {
            if (paymentSettled) return null;
            return (
              <>
                <br />
                <button type="button" onClick={() => {
                  this.props.ethereumStore.assertAuthenticated();
                  this.props.syndicateStore.settlePayment(
                    this.props.ethereumStore.activeAddress,
                    this.props.payment.index
                  );
                }}>Settle</button>
              </>
            );
          })()}
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
