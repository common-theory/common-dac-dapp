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

@inject('appStore')
@observer
export default class Header extends React.Component<any> {
  componentDidMount() {
    this.props.appStore.loadNetworkId();
  }

  render() {
    return (
      <HeaderBackground>
        <LogoText>Common Theory: NetworkID {this.props.appStore.networkId}</LogoText>
        <div>
          <HeaderLink to="/">Home</HeaderLink>
          <HeaderLink to="/about">About</HeaderLink>
        </div>
      </HeaderBackground>
    );
  }
}
