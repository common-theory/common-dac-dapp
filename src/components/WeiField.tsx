import React from 'react';
import TextInput from './TextInput';

export default class WeiField extends React.Component<{
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
      <TextInput
        placeholder="0.5"
        name="amount"
        onChange={event => this.amountChanged(event.target.value)}
        value={this.state.value}
      />
    );
  }
}
