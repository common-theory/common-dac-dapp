import React from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';

const AddressTextInput = styled(TextInput)`
  width: 44ch;
`;

export default class AddressField extends React.Component<{
  address: string,
  onChange: (newAddress: string) => void
}> {
  state = {
    isAddressValid: false
  };

  addressChanged = (text: string) => {
    this.setState({
      isAddressValid: web3.utils.isAddress(text)
    });
    this.props.onChange(text);
  };

  renderAddressValidity() {
    if (!this.props.address) return null;
    if (this.state.isAddressValid) {
      return 'Valid Address';
    } else {
      return 'Invalid Address';
    }
  }

  render() {
    return (
      <>
        <AddressTextInput
          placeholder="0x7726A9b0E93dE68bf24d40b37F6D0DC4e4caF47C"
          name="address"
          onChange={event => this.addressChanged(event.target.value)}
          value={this.props.address}
        />
        {this.renderAddressValidity()}
      </>
    );
  }
}
