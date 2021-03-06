import React from 'react';
import styled from 'styled-components';
import Colors from './Colors';

const Background = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  height: 10px;
  min-width: 30px;
  border-radius: 50px;
  border: 1px solid #000;
  margin: 8px;
`;

const Content = styled.div<{ percent: number }>`
  position: relative;
  background: ${Colors.greenDark};
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
