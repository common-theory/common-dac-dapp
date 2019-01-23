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
  position: relative;
  background: #18B23A;
  width: ${props => props.percent}%;
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s;
  border: 0px;
`;

export default class ProgressBar extends React.Component<{
  percent: number
}> {
  render() {
    return (
      <Background>
        <Content percent={Math.max(5, Math.round(this.props.percent))} />
      </Background>
    );
  }
}
