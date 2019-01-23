import React from 'react';
import { DarkLink, BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';

export default class MetamaskCell extends React.Component {
  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          Install Metamask
        </BlockHeader>
        <BlockElement>
          This contract uses <DarkLink href="https://metamask.io/" target="_blank">Metamask</DarkLink> for talking to the Ethereum network. Please install or login to interact with the contract.
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </BlockContainer>
    );
  }
}
