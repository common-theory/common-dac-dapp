import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore, { Proposal } from '../stores/DACStore';
import { BlockElement } from './Shared';

@inject('dacStore')
@observer
export default class ProposalCell extends React.Component<{ dacStore?: DACStore, proposal: Proposal }> {
  componentDidMount() {
    this.props.dacStore.loadMember(this.props.proposal.memberAddress);
  }

  render() {
    const member = this.props.dacStore.members[this.props.proposal.memberAddress] || {};
    return (
      <BlockElement>
        <div>
          <div>
            Proposal #{this.props.proposal.number}
          </div>
          <div>
            Vote cycle {this.props.proposal.voteCycle}
          </div>
          <div>
            Updating {this.props.proposal.memberAddress}
          </div>
          <div>
            Old ownership: {member.ownership}
          </div>
          <div>
            New ownership: {this.props.proposal.newOwnership}
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
    );
  }
}
