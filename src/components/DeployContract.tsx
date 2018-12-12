import React from 'react';
import { observer, inject } from 'mobx-react';
import Header from './Header';
import {
  BlockContainer,
  BlockElement,
  BlockHeader,
  BlockFooter
} from './Shared';
import Contract from './Contract';
import styled from 'styled-components';

const ContractWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

@inject()
@observer
export default class DeployContract extends React.Component <{}, {}> {
  render() {
    return (
      <>
        <Header />
        <>
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
              <ContractWrapper>
                <Contract name="decision" index={1} />
                <Contract name="syndicate" index={2} />
              </ContractWrapper>
            </BlockElement>
            <BlockFooter>
            </BlockFooter>
          </BlockContainer>
        </>
      </>
    );
  }
}
