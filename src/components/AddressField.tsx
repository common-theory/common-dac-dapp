import React from 'react';
import styled from 'styled-components';

const AddressInput = styled.input`
  font-family: Helvetica;
  width: 44ch;
  border-radius: 3px;
  border: 1px solid black;
`;

export default class AddressField extends React.Component<{
  address: string,
  isAddressValid: boolean
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
      return ' Valid Address';
    } else {
      return ' Invalid Address';
    }
  }
  
  render() {
    return (
      <>
        <AddressInput
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
