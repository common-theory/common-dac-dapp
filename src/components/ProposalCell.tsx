import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore, { Proposal } from '../stores/DACStore';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter, HFlex } from './Shared';

const TextSpan = styled.span`
  margin-left: 4px;
  margin-right: 4px;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

@inject('dacStore')
@observer
export default class ProposalCell extends React.Component<{ dacStore?: DACStore, proposal: Proposal }> {
  componentDidMount() {
    this.props.dacStore.loadMember(this.props.proposal.memberAddress);
  }

  renderVoteButtons = () => (
    <>
      <button onClick={() => {
        this.props.dacStore.voteForProposal(this.props.proposal.number, true);
      }} title="Accept">
       Accept
      </button>
      <button onClick={() => {
        this.props.dacStore.voteForProposal(this.props.proposal.number, false);
      }} title="Reject">
      Reject
      </button>
    </>
  );

  renderProposalState() {
    if (this.props.proposal.totalRejectingVotes != 0) {
      return (
        <>
          <ion-icon
            size="medium"
            name="close-circle"
            style={{ color: 'red' }}
          />
          <TextSpan>Rejected</TextSpan>
        </>
      );
    }
    if (this.props.proposal.applied) {
      return (
        <>
          <ion-icon
            size="medium"
            name="checkmark-circle"
            style={{ color: 'limegreen' }}
          />
          <TextSpan>Accepted</TextSpan>
        </>
      );
    }
    return (
      <>
        <ion-icon
          size="medium"
          name="alert"
          style={{ color: 'gold' }}
        />
        <TextSpan>Awaiting Vote</TextSpan>
      </>
    )
  }

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          <TextSpan>Proposal {this.props.proposal.number} - </TextSpan>
          {this.renderProposalState()}
        </BlockHeader>
        <BlockElement>
          <HFlex>
            <TextSpan>{this.props.proposal.memberAddress} <BoldText>value</BoldText> {this.props.proposal.oldValue}</TextSpan>
            <ion-icon size="medium" name="arrow-round-forward" />
            <TextSpan>{this.props.proposal.newValue}</TextSpan>
          </HFlex>
          {this.props.dacStore.currentVoteCycle === this.props.proposal.voteCycle ? this.renderVoteButtons() : null}
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
