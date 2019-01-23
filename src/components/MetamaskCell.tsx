import React from 'react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';

export default class MetamaskCell extends React.Component {
  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          Install Metamask
        </BlockHeader>
        <BlockElement>
          This contract uses <a href="https://metamask.io/" target="_blank">Metamask</a> for talking to the Ethereum network. Please install or login to interact with the contract.
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
