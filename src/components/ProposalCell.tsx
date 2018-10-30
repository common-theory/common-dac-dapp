import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore, { Proposal } from '../stores/DACStore';
import { BlockElement, BlockHeader, BlockFooter } from './Shared';

@inject('dacStore')
@observer
export default class ProposalCell extends React.Component<{ dacStore?: DACStore, proposal: Proposal }> {
  componentDidMount() {
    this.props.dacStore.loadMember(this.props.proposal.memberAddress);
  }

  render() {
    return (
      <>
        <BlockHeader>
          Proposal {this.props.proposal.number} - {this.props.proposal.creator}
        </BlockHeader>
        <BlockElement>
          <div>
            <div>
              Vote cycle {this.props.proposal.voteCycle}
            </div>
            <div>
              Updating {this.props.proposal.memberAddress}
            </div>
            <div>
              Old Value: {this.props.proposal.oldValue}
            </div>
            <div>
              New Value: {this.props.proposal.newValue}
            </div>
            <div>
              Applied: {this.props.proposal.applied ? 'YES' : 'NO'}
            </div>
            {this.props.dacStore.currentVoteCycle === this.props.proposal.voteCycle ? (
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
            ) : null}
          </div>
        </BlockElement>
        <BlockFooter />
      </>
    );
  }
}
