import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px;
  padding: 4px;
  cursor: pointer;
  border-radius: 2px;
  border: 1px solid #000;
`;

export default class Button extends React.Component<{
  onClick: () => void
}> {
  render() {
    return (
      <Container onClick={this.props.onClick}>
        {this.props.children}
      </Container>
    );
  }
}
