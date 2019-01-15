import React from 'react';
import { Payment } from '../stores/Syndicate';
import TimerDisplay from './TimerDisplay';
import WeiDisplay from './WeiDisplay';
import SyndicateStore from '../stores/Syndicate';
import { HFlex } from './Shared';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import AddressDisplay from './AddressDisplay';

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
          <AddressDisplay address={this.props.payment.sender} />
          <ion-icon size="medium" name="arrow-round-forward" />
          <AddressDisplay address={this.props.payment.receiver} />
        </HFlex>
        Time: <TimerDisplay seconds={+this.props.payment.time} />
        <br />
        Total Value: <WeiDisplay wei={this.props.payment.weiValue} />
        <br />
        Total Paid: <WeiDisplay wei={this.props.payment.weiPaid} />
        <br />
        Total Available: <WeiDisplay wei={this.props.payment.weiOwed} />
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
      </>
    );
  }
}
