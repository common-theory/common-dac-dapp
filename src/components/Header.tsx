import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import EthereumStore from '../stores/Ethereum';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderBackground = styled.div`
  // background-color: #00F;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 70px;
  z-index: -1;
  // border-bottom: 1px solid #eff0f4;
`;

const HeaderContentContainer = styled.div`
  margin: 8px;
  margin-bottom: 0px;
  padding-left: 8px;
  padding-right: 8px;
  color: black;
  font-family: Helvetica;
`;

const TitleContentContainer = styled.div`
  margin: 8px;
  margin-bottom: 0px;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  align-items: flex-end;
`;

const RightText = styled.div`
  margin-top: 4px;
  font-size: 10pt;
  text-align: right;
`;

const HeaderA = styled.a`
  color: black;
  font-family: Helvetica;
  text-decoration: none;
`;

const LogoText = styled.span`
  color: black;
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

@inject('ethereumStore')
@observer
class Header extends React.Component<{
  ethereumStore?: EthereumStore
}> {
  render() {
    return (
      <HeaderContainer>
        <HeaderBackground />
        <TitleContentContainer>
          <>
            <HeaderLink to="/">
              <LogoText>
                Common Theory
              </LogoText>
            </HeaderLink>
          </>
        </TitleContentContainer>
        <HeaderContentContainer>
          <RightText>
            Network ID: {this.props.ethereumStore.networkId}
          </RightText>
          <RightText>
            Current Block: {this.props.ethereumStore.currentBlockNumber}
          </RightText>
          <RightText>
            <HeaderA href={this.props.ethereumStore.etherscanUrl()} target="_blank">
              {this.props.ethereumStore.activeAddress || 'Unauthenticated!'}
            </HeaderA>
          </RightText>
        </HeaderContentContainer>
      </HeaderContainer>
    );
  }
}

export default withRouter(props => <Header {...props} />);
