import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore from '../stores/DACStore';
import ProposalCell from './ProposalCell';
import { Container } from './Shared';
import Members from './Members';
import CreateProposal from './CreateProposal';
import ContractInfo from './ContractInfo';

const HeaderText = styled.div`
  font-family: Helvetica;
  font-size: 20pt;
  text-align: center;
  color: white;
`;

const Footer = styled.div`
  text-align: center;
`;

@inject('dacStore')
@observer
export default class Home extends React.Component<{ dacStore: DACStore }> {

  render() {
    return (
      <>
        <Header />
        <Container>
          <ContractInfo />
          <CreateProposal />
          <HeaderText>
            Proposals
          </HeaderText>
          <div>
            {[...this.props.dacStore.proposals].reverse().map(proposal => {
              return (
                <ProposalCell key={proposal.number} proposal={proposal} />
              );
            })}
          </div>
          <Footer>
            <a href="https://github.com/common-theory" target="_blank">
              <img title="common-theory source code" src="https://ipfs.io/ipns/commontheory.io/github-logo-white.png" width="50px" height="50px" />
            </a>
          </Footer>
        </Container>
      </>
    );
  }
}
