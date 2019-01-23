import React from 'react';
import { observer, inject } from 'mobx-react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import EthereumStore from '../stores/Ethereum';
import SyndicateStore from '../stores/Syndicate';
import GDAXStore from '../stores/GDAX';
import AddressField from './AddressField';
import WeiDisplay from './WeiDisplay';
import WeiField from './WeiField';
import TextInput from './TextInput';

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
    time: number
  } = {
    toAddress: '',
    weiValue: 0,
    timeUnit: 'seconds',
    time: 0
  };

  createPayment = (e: any) => {
    e.preventDefault();
    if (!this.props.ethereumStore.activeAddress) {
      alert('No active Ethereum account detected!');
      return;
    }
    this.props.syndicateStore.deposit(
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
        return this.state.time;
      case 'minutes':
        return this.state.time * 60;
      case 'hours':
        return this.state.time * 60 * 60;
      case 'days':
        return this.state.time * 60 * 60 * 24;
      case 'months':
        return this.state.time * 60 * 60 * 30;
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

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          Create Payment
        </BlockHeader>
        <BlockElement>
          <p>
            Send Ether to an address over time.
          </p>
          <form onSubmit={this.createPayment}>
            <label>
              To:
              <AddressField
                onChange={toAddress => this.setState({ toAddress })}
                address={this.state.toAddress}
              />
            </label>
            <br />
            <label>
              Amount:
              <WeiField
                onChange={weiValue => this.setState({
                  weiValue
                })}
              />
            </label>
            <WeiDisplay wei={this.state.weiValue} />
            <br />
            <label>
              Time:
              <TextInput
                onChange={event => this.setState({
                  time: event.target.value
                })}
                value={this.state.time}
              />
            </label>
            <label>
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
            </label>
            <br />
            <input type="submit" value="Create" />
          </form>
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
