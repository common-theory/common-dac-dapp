import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
  position: relative;
  height: 10px;
  width: 200px;
  border-radius: 50px;
  border: 1px solid #000;
`;

const Content = styled.div<{ percent: number }>`
  background: #18B23A;
  width: ${props => props.percent}%;
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s;
`;

export default class ProgressBar extends React.Component<{
  percent: number
}> {
  render() {
    return (
      <Background>
        <Content percent={this.props.percent} />
      </Background>
    );
  }
}
