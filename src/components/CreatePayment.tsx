import React from 'react';
import { observer, inject } from 'mobx-react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';
import styled from 'styled-components';
import EthereumStore from '../stores/Ethereum';
import SyndicateStore from '../stores/Syndicate';
import GDAXStore from '../stores/GDAX';

const AddressInput = styled.input`
  font-family: Helvetica;
  width: 44ch;
  border-radius: 3px;
  border: 1px solid black;
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
    amount: number,
    timeUnit: 'seconds' | 'minutes' | 'hours' | 'days' | 'months',
    time: number
  } = {
    toAddress: '',
    amount: 0,
    timeUnit: 'seconds',
    time: 0
  };

  createPayment = (e: any) => {
    e.preventDefault();
    if (!this.props.ethereumStore.activeAddress) {
      alert('No active Ethereum account detected!');
      return;
    }
    const weiAmount = web3.utils.toWei(this.state.amount, 'ether');
    this.props.syndicateStore.deposit(
      this.props.ethereumStore.activeAddress,
      this.state.toAddress,
      this.timeInSeconds(),
      weiAmount
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
              <AddressInput
                placeholder={'0x7726A9b0E93dE68bf24d40b37F6D0DC4e4caF47C'}
                name="toAddress"
                onChange={event => this.setState({
                  toAddress: event.target.value
                })}
                value={this.state.toAddress}
              />
            </label>
            <br />
            <label>
              Amount:
              <input
                type="number"
                name="amount"
                step="any"
                min="0"
                onChange={event => this.setState({
                  amount: event.target.value
                })}
                value={this.state.amount}
              />
            </label>
            {` ether ~= $${Math.round(1e2 * this.state.amount * this.props.gdaxStore.ethPrice) / 1e2}`}
            <br />
            <label>
              Time:
              <input
                type="number"
                name="time"
                min="0"
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
            <input type="submit" value="Send" />
          </form>
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
