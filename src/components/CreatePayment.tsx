import React from 'react';
import { observer, inject } from 'mobx-react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';

@inject()
@observer
export default class CreatePayment extends React.Component {

  state: {
    toAddress: string
  } = {
    toAddress: ''
  };

  createPayment() {
    console.log('Create payment');
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
              <input
                placeholder={'0x7726A9b0E93dE68bf24d40b37F6D0DC4e4caF47C'}
                name="toAddress"
                value={this.state.toAddress}
                onChange={event => this.setState({
                  toAddress: event.target.value
                })}
              />
            </label>
          </form>
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
