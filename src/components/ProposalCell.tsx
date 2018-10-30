import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore, { Proposal } from '../stores/DACStore';
import { BlockElement, BlockHeader, BlockFooter, HFlex } from './Shared';

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

  render() {
    return (
      <>
        <BlockHeader>
          <TextSpan>Proposal {this.props.proposal.number} - </TextSpan>
          <ion-icon
            size="medium"
            name="checkmark-circle"
            style={{ color: 'limegreen' }}
          />
          <TextSpan>Applied</TextSpan>
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
      </>
    );
  }
}
