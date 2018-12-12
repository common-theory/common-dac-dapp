import React from 'react';
import { observer, inject } from 'mobx-react';
import Header from './Header';
import {
  BlockContainer,
  BlockElement,
  BlockHeader,
  BlockFooter
} from './Shared';

@inject()
@observer
export default class DeployContract extends React.Component <{}, {}> {
  render() {
    return (
      <>
        <Header />
        <BlockContainer>
          <BlockHeader>
            Deploy a Syndicate
          </BlockHeader>
          <BlockElement>
            <p>
              A syndicate has two components:
              <br />
                1. A decision contract used for controlling other contracts
              <br />
                2. A syndicate contract used for storing and routing funds
            </p>
          </BlockElement>
          <BlockFooter>
          </BlockFooter>
        </BlockContainer>
      </>
    );
  }
}
