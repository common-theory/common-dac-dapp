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
  onChange: (newAddress: string) => void
}> {
  render() {
    return (
      <>
        <AddressInput
          placeholder="0x7726A9b0E93dE68bf24d40b37F6D0DC4e4caF47C"
          name="address"
          onChange={event => this.props.onChange(event.target.value)}
          value={this.props.address}
        />
      </>
    );
  }
}
