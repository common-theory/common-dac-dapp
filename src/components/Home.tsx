import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore from '../stores/DACStore';
import ProposalCell from './ProposalCell';
import { Container, BlockElement } from './Shared';
import Members from './Members';

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
  timeout: NodeJS.Timeout;
  state = {
    cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining(),
    timer: 0
  };

  componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState({
        cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    return (
      <>
        <Header />
        <Container>
          <HeaderText>Contract Information</HeaderText>
          <BlockElement>
            <Members />
            <div>
              Total Members: {this.props.dacStore.totalVotingMembers}
            </div>
            <div>
              Total Value: {this.props.dacStore.totalValue}
            </div>
            <div>
              Current Vote Cycle: {this.props.dacStore.currentVoteCycle}
            </div>
            <div>
              Cycle Time Remaining: {this.state.cycleTimeRemaining} seconds
            </div>
            <div>
              Proposal Count: {this.props.dacStore.proposalCount}
            </div>
          </BlockElement>
          <HeaderText>Proposals</HeaderText>
          <div>
            {[...this.props.dacStore.proposals].reverse().map(proposal => {
              return (
                <ProposalCell key={proposal.number} proposal={proposal} />
              );
            })}
          </div>
          <Footer>
            <a href="https://github.com/common-theory/common-dac-dapp" target="_blank">
              <img title="common-theory source code" src="https://ipfs.io/ipns/commontheory.io/github-logo-white.png" width="50px" height="50px" />
            </a>
          </Footer>
        </Container>
      </>
    );
  }
}
