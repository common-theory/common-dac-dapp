import React from 'react';
import { inject, observer } from 'mobx-react';
import { TextSpan, ForkIcon, OutIcon, CheckIcon, HFlex, VFlex, BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import SyndicateStore, { Payment } from '../stores/Syndicate';
import EthereumStore from '../stores/Ethereum';
import TimerDisplay from './TimerDisplay';
import ForkControls from './ForkControls';
import PaymentInfo from './PaymentInfo';
import Colors from './Colors';
import Popup from 'reactjs-popup';

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
        <VFlex style={{ flex: 1 }}>
          <PaymentInfo payment={this.props.payment} />
        </VFlex>
        <Popup
          trigger={
            <ForkIcon style={{
              height: 40,
              width: 40,
              fill: Colors.gray
            }} />
          }
          position="top center"
          on="hover"
        >
          <>
            {`Part of a payment can be forked to another address. Forking marks the parent payment as settled and creates two new payments.`}
          </>
        </Popup>
        <VFlex style={{ flex: 1 }}>
          <ForkControls payment={this.props.payment} />
        </VFlex>
      </HFlex>
    );
  };

  renderHeaderText = () => {
    if (this.props.payment.settled) {
      return (
        <HFlex style={{
          justifyContent: 'space-between',
          flex: 1
        }}>
          <HFlex>
            <CheckIcon style={{
              fill: Colors.greenDark,
              width: 30,
              height: 30,
              marginRight: 2
            }} />
            <TextSpan>{'| Completed'}</TextSpan>
          </HFlex>
          <TextSpan>#{this.props.payment.index}</TextSpan>
        </HFlex>
      );
    }
    return (
      <HFlex style={{
        justifyContent: 'space-between',
        flex: 1
      }}>
        <HFlex>
          <OutIcon style={{
            fill: Colors.blue,
            height: 30,
            width: 30,
            marginRight: 2
          }} />
          <TextSpan>{`| ${TimerDisplay.formatSeconds(this.props.payment.timeRemaining)} remaining`}</TextSpan>
        </HFlex>
        <TextSpan>#{this.props.payment.index}</TextSpan>
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
