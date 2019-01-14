import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Container } from './Shared';
import ContractInfo from './ContractInfo';
import CreatePayment from './CreatePayment';
import PaymentCell from './PaymentCell';
import SyndicateStore from '../stores/Syndicate';
import BalanceInfo from './BalanceInfo';

const HeaderText = styled.div`
  font-family: Helvetica;
  font-size: 20pt;
  text-align: center;
  color: white;
`;

const Footer = styled.div`
  margin-top: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterLink = styled.a`
  margin: 8px;
`;

@inject('syndicateStore')
@observer
export default class Home extends React.Component <{
  syndicateStore?: SyndicateStore
}> {

  render() {
    return (
      <>
        <Header />
        <Container>
          <ContractInfo />
          <BalanceInfo />
          <CreatePayment />
          <HeaderText>
            Payments
          </HeaderText>
          <div>
            {[...this.props.syndicateStore.payments].reverse().map((payment, i) => {
              return (
                <PaymentCell payment={payment} key={i} />
              );
            })};
          </div>
          <Footer>
            <FooterLink href="https://github.com/common-theory" target="_blank">
              <img title="common-theory source code" src="https://ipfs.io/ipns/commontheory.io/github-logo-white.png" width="40px" height="40px" />
            </FooterLink>
            <FooterLink href="https://discord.gg/4FFVg8a" target="_blank">
              <img title="discord" src="https://ipfs.io/ipns/commontheory.io/discord-logo-white.png" width="40px" height="40px" />
            </FooterLink>
          </Footer>
        </Container>
      </>
    );
  }
}
