import React from 'react';
import { observer, inject } from 'mobx-react';
import { DarkLink, VFlex, HLine, ClipboardIcon, HFlex, InternalCell, BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import EthereumStore from '../stores/Ethereum';
import SyndicateStore from '../stores/Syndicate';
import GDAXStore from '../stores/GDAX';
import AddressField from './AddressField';
import WeiDisplay from './WeiDisplay';
import WeiField from './WeiField';
import TextInput from './TextInput';
import Button from './Button';
import styled from 'styled-components';
import Popup from 'reactjs-popup';

const TextSpan = styled.span`

`;

@inject('syndicateStore', 'ethereumStore', 'gdaxStore')
@observer
export default class CreatePayment extends React.Component <{
  syndicateStore?: SyndicateStore,
  ethereumStore?: EthereumStore,
  gdaxStore?: GDAXStore
}> {

  state: {
    toAddress: string,
    weiValue: number|string,
    timeUnit: 'seconds' | 'minutes' | 'hours' | 'days' | 'months',
    time: number|string
  } = {
    toAddress: '',
    weiValue: 0,
    timeUnit: 'days',
    time: ''
  };

  createPayment = () => {
    if (!this.props.ethereumStore.activeAddress) {
      alert('No active Ethereum account detected!');
      return;
    }
    this.props.syndicateStore.paymentCreate(
      this.props.ethereumStore.activeAddress,
      this.state.toAddress,
      this.timeInSeconds(),
      this.state.weiValue
    )
      .then(this.resetForm)
      .catch((err: any) => {
        console.log('Payment creation error', err);
        alert('Payment creation failed');
        this.resetForm();
      });
  }

  timeInSeconds = () => {
    switch (this.state.timeUnit) {
      case 'seconds':
        return +this.state.time;
      case 'minutes':
        return +this.state.time * 60;
      case 'hours':
        return +this.state.time * 60 * 60;
      case 'days':
        return +this.state.time * 60 * 60 * 24;
      case 'months':
        return +this.state.time * 60 * 60 * 30;
      default:
        throw new Error(`Invalid time unit specified ${this.state.timeUnit}`);
    }
  };

  resetForm = () => {
    this.setState({
      toAddress: '',
      amountUnit: 'ether',
      amount: 0,
      time: 0
    });
  }

  renderCreation = () => (
    <InternalCell>
      <VFlex style={{ flex: 1 }}>
        <TextSpan>Create Payment</TextSpan>
        <HFlex>
          <TextSpan>To:</TextSpan>
          <AddressField
            onChange={toAddress => this.setState({ toAddress })}
            address={this.state.toAddress}
          />
        </HFlex>
        <HFlex>
          <TextSpan>Amount:</TextSpan>
          <WeiField
            onChange={weiValue => this.setState({
              weiValue
            })}
          />
          <WeiDisplay wei={this.state.weiValue} />
        </HFlex>
        <HFlex>
          <TextSpan>Time:</TextSpan>
          <TextInput
            placeholder={'10'}
            onChange={event => this.setState({
              time: event.target.value
            })}
            value={this.state.time}
          />
          <select
            value={this.state.timeUnit}
            onChange={event => this.setState({
              timeUnit: event.target.value
            })}
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </HFlex>
        <Button onClick={() => {
          this.createPayment();
        }}>
          Create Payment
        </Button>
      </VFlex>
    </InternalCell>
  );

  renderContract = () => {
    const contractAddress = this.props.syndicateStore.addressForNetwork(this.props.ethereumStore.networkId);
    return (
      <InternalCell>
        <VFlex>
          <HFlex>
            <TextSpan>Contract Address</TextSpan>
          </HFlex>
          <HLine />
          <HFlex>
          <DarkLink
            style={{ fontSize: 14 }}
            href={this.props.ethereumStore.etherscanUrl(contractAddress)}
            target='_blank'
          >
            {contractAddress}
          </DarkLink>
          </HFlex>
          <HFlex>
          <WeiDisplay wei={this.props.syndicateStore.balance} />
          </HFlex>
        </VFlex>
      </InternalCell>
    );
  };

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          Syndicate - distribute ether in time
        </BlockHeader>
        <BlockElement>
          <HFlex>
            {this.renderContract()}
            <Popup
              trigger={<ClipboardIcon style={{
                width: 40,
                height: 40
              }} />}
              position="top center"
              on="hover"
            >
            <>
              The Syndicate contract allows Ether to be paid over time to other addresses. These are called payments.
            </>
            </Popup>
            {this.renderCreation()}
          </HFlex>
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
