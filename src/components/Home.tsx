import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore from '../stores/DACStore';
import ProposalCell from './ProposalCell';
import { Container, BlockElement } from './Shared';

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
          <BlockElement>
            <div>
              Total Members: {this.props.dacStore.totalVotingMembers}
            </div>
            <div>
              Total Ownership: {this.props.dacStore.totalOwnership}
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
          <div>
            {this.props.dacStore.proposals.map(proposal => {
              return (
                <ProposalCell key={proposal.number} proposal={proposal} />
              );
            })}
          </div>
        </Container>
      </>
    );
  }
}
