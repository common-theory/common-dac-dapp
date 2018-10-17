import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

const HeaderBackground = styled.div`
  width: 100%;
  padding: 8px;
  background-color: #00F;
`;

const LogoText = styled.span`
  color: white;
  font-family: Helvetica;
`;

const HeaderLink = styled(Link)`
  color: white;
`;

@inject('ethStore')
@observer
export default class Header extends React.Component<any> {
  render() {
    return (
      <HeaderBackground>
        <LogoText>Common Theory: NetworkID {this.props.ethStore.networkId} : Current Block Height {this.props.ethStore.currentBlockNumber}</LogoText>
        <div>
          <HeaderLink to="/">Home</HeaderLink>
          <HeaderLink to="/about">About</HeaderLink>
        </div>
      </HeaderBackground>
    );
  }
}
