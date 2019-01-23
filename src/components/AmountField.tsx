import React from 'react';
import styled from 'styled-components';

const AmountInput = styled.input`
  margin: 4px;
  font-family: Helvetica;
  width: 44ch;
  border-radius: 3px;
  border: 1px solid black;
`;

export default class AmountField extends React.Component<{
  onChange: (newWeiValue: string) => void
}> {
  state = {
    value: ''
  };
  amountChanged = (amount: string) => {
    if (!isNaN(+amount)) {
      this.props.onChange(web3.utils.toWei(amount || '0'));
      this.setState({ value: amount });
    }
  };
  render() {
    return (
      <AmountInput
        placeholder="0.5"
        name="amount"
        onChange={event => this.amountChanged(event.target.value)}
        value={this.state.value}
      />
    );
  }
}
