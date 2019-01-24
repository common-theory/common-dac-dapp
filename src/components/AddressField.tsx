import React from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import { CheckIcon, CloseIcon } from './Shared';
import Colors from './Colors';

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
    if (!this.props.address) return <div style={{ width: 30, height: 30 }} />;
    if (this.state.isAddressValid) {
      return <CheckIcon style={{
        fill: Colors.greenDark,
        width: 30,
        height: 30
      }} />;
    } else {
      return <CloseIcon style={{
        fill: Colors.red,
        width: 30,
        height: 30
      }} />;
    }
  }

  render() {
    return (
      <>
        <AddressTextInput
          placeholder="0x7726A9b0E93dE68bf24d40b37F6D0DC4e4caF47C"
          name="address"
          onChange={(event: any) => this.addressChanged(event.target.value)}
          value={this.props.address}
        />
        {this.renderAddressValidity()}
      </>
    );
  }
}
