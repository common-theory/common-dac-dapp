import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

/**
 * A component for customizing and deploying smart contracts
 **/

const ContractContainer = styled.div`
  border-style: solid;
  border-width: 2px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContractSection = styled.div`
  border-bottom-style: dashed;
  border-bottom-width: 2px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 4px;
  padding-bottom: 4px;
`;

const ContractDeploySection = styled.button`
  margin-top: 4px;
  margin-bottom: 4px;
`;

@inject()
@observer
export default class Contract extends React.Component <{}, {}> {
  render() {
    return (
      <>
        Contract #1
        <ContractContainer>
          <ContractSection>
            {/* the contract name */}
            decision
          </ContractSection>
          <ContractSection>
            members
          </ContractSection>
          <ContractDeploySection>
            deploy
          </ContractDeploySection>
        </ContractContainer>
      </>
    );
  }
}
