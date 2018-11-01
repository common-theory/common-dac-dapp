import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore, { Proposal } from '../stores/DACStore';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter, HFlex } from './Shared';
import Colors from './Colors';

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
            style={{ color: Colors.red() }}
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
            style={{ color: Colors.green() }}
          />
          <TextSpan>Accepted</TextSpan>
        </>
      );
    }
    if (this.props.proposal.voteCycle == this.props.dacStore.currentVoteCycle) {
      return (
        <>
          <ion-icon
            size="medium"
            name="alert"
            style={{ color: Colors.green() }}
          />
          <TextSpan>Voting Active</TextSpan>
        </>
      );
    }
    if (+this.props.proposal.voteCycle < +this.props.dacStore.currentVoteCycle) {
      return (
        <>
          <ion-icon
            size="medium"
            name="close-circle"
            style={{ color: Colors.red() }}
          />
          <TextSpan>Rejected</TextSpan>
        </>
      );
    }
    return (
      <>
        <ion-icon
          size="medium"
          name="alert"
          style={{ color: Colors.yellow() }}
        />
        <TextSpan>Vote Upcoming</TextSpan>
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
          <HFlex>
            <TextSpan>
              <ion-icon style={{ color: Colors.green() }} name="thumbs-up" />
              {this.props.proposal.totalAcceptingVotes}
            </TextSpan>
            <TextSpan>
              <ion-icon style={{ color: Colors.red() }} name="thumbs-down" />
              {this.props.proposal.totalRejectingVotes}
            </TextSpan>
          </HFlex>
          <HFlex>
            {this.props.proposal.description || 'No description provided.'}
          </HFlex>
          {this.props.dacStore.currentVoteCycle === this.props.proposal.voteCycle ? this.renderVoteButtons() : null}
        </BlockElement>
        <BlockFooter />
      </BlockContainer>
    );
  }
}
