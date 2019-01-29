import React from 'react';
import { Payment } from '../stores/Syndicate';
import TimerDisplay from './TimerDisplay';
import WeiDisplay from './WeiDisplay';
import SyndicateStore from '../stores/Syndicate';
import { HLine, HFlex, VFlex, InternalCell } from './Shared';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import AddressDisplay from './AddressDisplay';
import ProgressBar from './ProgressBar';
import Button from './Button';

@inject('ethereumStore', 'syndicateStore')
@observer
export default class PaymentInfo extends React.Component<{
  payment: Payment,
  ethereumStore?: EthereumStore,
  syndicateStore?: SyndicateStore
}> {
  /**
   * This breaks mobx @observer; that should be alright as the PaymentCell
   * updates every second (so we don't need to have events pushed to us)
   *
   * If this is used in a non-autoupdating component this will need to be
   * refactored.
   **/
  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { payment } = this.props;
    const percent = 100 * (+payment.time - +payment.timeRemaining) / +payment.time;
    return (
      <InternalCell>
        <HFlex>
          <AddressDisplay address={this.props.payment.sender} />
          <VFlex style={{ flex: 1 }}>
            <HFlex style={{ flex: 1, justifyContent: 'center' }}>
              <WeiDisplay wei={this.props.payment.weiValue} />
            </HFlex>
            <HFlex style={{ flex: 1 }}>
              <ProgressBar percent={percent} />
            </HFlex>
            <HFlex style={{ flex: 1, justifyContent: 'center' }}>
              <TimerDisplay seconds={+this.props.payment.time} />
            </HFlex>
          </VFlex>
          <AddressDisplay address={this.props.payment.receiver} />
        </HFlex>
        <VFlex style={{
          alignItems: 'center'
        }}>
          <HLine />
        </VFlex>
        <VFlex>
          <div>
            Available: <WeiDisplay wei={this.props.payment.weiOwed} />
          </div>
          {
            this.props.payment.settled ? null : (
              <Button onClick={() => {
                this.props.ethereumStore.assertAuthenticated();
                this.props.syndicateStore.paymentSettle(
                  this.props.ethereumStore.activeAddress,
                  this.props.payment.index
                );
              }}>
              Settle Payment
              </Button>
            )
          }
        </VFlex>
      </InternalCell>
    );
  }
}
