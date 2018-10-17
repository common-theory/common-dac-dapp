import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import EthStore from '../stores/EthStore';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderBackground = styled.div`
  background-color: #00F;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 70px;
  z-index: -1;
  border-bottom: 1px solid #eff0f4;
`;

const HeaderContentContainer = styled.div`
  margin: 8px;
  color: white;
  font-family: Helvetica;
`;

const RightText = styled.div`
  margin-top: 4px;
  font-size: 10pt;
  text-align: right;
`;

const HeaderA = styled.a`
  color: white;
  font-family: Helvetica;
  text-decoration: none;
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

@inject('ethStore')
@observer
export default class Header extends React.Component<{
  ethStore: EthStore
}> {
  render() {
    return (
      <HeaderContainer>
        <HeaderBackground />
        <HeaderContentContainer>
          <LogoText>Common Theory</LogoText>
          <LinkContainer>
            <HeaderLink to="/">Home</HeaderLink>
            <HeaderLink to="/create">Create</HeaderLink>
            <HeaderLink to="/about">About</HeaderLink>
          </LinkContainer>
        </HeaderContentContainer>
        <HeaderContentContainer>
          <RightText>
            Network ID: {this.props.ethStore.networkId}
          </RightText>
          <RightText>
            Current Block: {this.props.ethStore.currentBlockNumber}
          </RightText>
          <RightText>
            <HeaderA href={this.props.ethStore.etherscanUrl()} target="_blank">
              {this.props.ethStore.activeAddress() || 'Unauthenticated!'}
            </HeaderA>
          </RightText>
        </HeaderContentContainer>
      </HeaderContainer>
    );
  }
}
