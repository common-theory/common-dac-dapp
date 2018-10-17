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
  font-size: 20pt;
`;

const LinkContainer = styled.div`
  padding-top: 8px;
`;

const HeaderLink = styled(Link)`
  color: white;
  font-family: Helvetica;
  margin-right: 8px;
  text-decoration: none;
`;

@inject('ethStore', 'dacStore')
@observer
export default class Header extends React.Component<any> {
  render() {
    return (
      <HeaderBackground>
        <LogoText>Common Theory</LogoText>
        <LinkContainer>
          <HeaderLink to="/">Home</HeaderLink>
          <HeaderLink to="/about">About</HeaderLink>
        </LinkContainer>
      </HeaderBackground>
    );
  }
}
