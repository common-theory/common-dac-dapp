import React from 'react';
import { Payment } from '../stores/Syndicate';
import TimerDisplay from './TimerDisplay';
import WeiDisplay from './WeiDisplay';
import SyndicateStore from '../stores/Syndicate';
import { HFlex, VFlex, GrayContainer } from './Shared';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import AddressDisplay from './AddressDisplay';
import styled from 'styled-components';

const Container = styled.div`
  min-width: 400px;
`;

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
    return (
      <Container>
        <GrayContainer>
          <HFlex>
            <AddressDisplay address={this.props.payment.sender} />
            <VFlex>
              <HFlex>
                <WeiDisplay showUSD={false} wei={this.props.payment.weiValue} />
              </HFlex>
              <HFlex>
                <ion-icon size="medium" name="arrow-round-forward" />
              </HFlex>
              <HFlex>
                <TimerDisplay seconds={+this.props.payment.time} />
              </HFlex>
            </VFlex>
            <AddressDisplay address={this.props.payment.receiver} />
          </HFlex>
        </GrayContainer>
        <br />
        <GrayContainer>
          <VFlex>
            Owed: <WeiDisplay wei={this.props.payment.weiOwed} />
            <br />
            Settled: <WeiDisplay wei={this.props.payment.weiPaid} />
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
          </VFlex>
        </GrayContainer>
      </Container>
    );
  }
}
