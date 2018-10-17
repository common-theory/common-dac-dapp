import React from 'react';
import Header from './Header';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 8px;
`;

@observer
export default class CreateProposal extends React.Component {
  render() {
    return (
      <>
        <Header />
        <Container>
          Create a proposal
        </Container>
      </>
    );
  }
}
