import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

/**
 * A component for customizing and deploying smart contracts
 **/

const Wrapper = styled.div`
  margin: 4px;
`;

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
export default class Contract extends React.Component <{
  name: string,
  index: number,
  arguments?: {
    type: 'number' | 'string',
    name: string
  }[]
}, {}> {

  handleDeploy = () => {
    console.log(`Deploy pressed for contract ${this.props.name}`);
  };

  render() {
    return (
      <Wrapper>
        Contract #{this.props.index}
        <ContractContainer>
          <ContractSection>
            {/* the contract name */}
            {this.props.name}
          </ContractSection>
          <ContractSection>
            members
          </ContractSection>
          <ContractDeploySection onClick={this.handleDeploy}>
            deploy
          </ContractDeploySection>
        </ContractContainer>
      </Wrapper>
    );
  }
}
