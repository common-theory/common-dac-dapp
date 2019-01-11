import React from 'react';
import { Payment } from '../stores/Syndicate';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #EEE;
`;

export default class ForkControls extends React.Component <{
  payment: Payment
}> {
  render() {
    return (
      <Container>
        <button type="button" onClick={() => {
          console.log('fork');
        }}>Fork Payment</button>
      </Container>
    );
  }
}
