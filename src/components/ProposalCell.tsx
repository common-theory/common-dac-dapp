import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Proposal } from '../stores/DACStore';

const Container = styled.div`
  padding: 8px;
`;

@observer
export default class ProposalCell extends React.Component<{ proposal: Proposal }> {
  render() {
    return (
      <Container>
        <div>
          <div>
            Proposal #{this.props.proposal.number}
          </div>
          <div>
            Vote cycle {this.props.proposal.voteCycle}:
          </div>
        </div>
      </Container>
    );
  }
}
