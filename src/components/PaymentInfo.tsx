import React from 'react';
import { Payment } from '../stores/Syndicate';
import TimerDisplay from './TimerDisplay';
import WeiDisplay from './WeiDisplay';
import SyndicateStore from '../stores/Syndicate';
import { HFlex } from './Shared';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';

@inject('ethereumStore', 'syndicateStore')
@observer
export default class PaymentInfo extends React.Component<{
  payment: Payment,
  ethereumStore?: EthereumStore,
  syndicateStore?: SyndicateStore
}> {
  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <>
        <HFlex>
          {this.props.payment.sender}
          <ion-icon size="medium" name="arrow-round-forward" />
          {this.props.payment.receiver}
        </HFlex>
        Time: <TimerDisplay seconds={+this.props.payment.time} />
        <br />
        Total Value: <WeiDisplay wei={this.props.payment.weiValue} />
        <br />
        Total Paid: <WeiDisplay wei={this.props.payment.weiPaid} />
        <br />
        Total Available: <WeiDisplay wei={this.props.payment.weiOwed} />
        <br />
        Is Fork: {this.props.payment.isFork ? 'YES' : 'NO'}
        {
          this.props.payment.isFork ? (
            <>
              <br />
              Parent Payment Index: {this.props.payment.parentIndex}
            </>
          ) : null
        }
        {
          this.props.payment.settled ? null : (
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
          )
        }
        <br />
      </>
    );
  }
}
