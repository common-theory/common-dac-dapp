import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Container } from './Shared';
import ContractInfo from './ContractInfo';
import CreatePayment from './CreatePayment';
import PaymentCell from './PaymentCell';
import SyndicateStore from '../stores/Syndicate';
import Footer from './Footer';
import BalanceCell from './BalanceCell';
import EthereumStore from '../stores/Ethereum';
import MetamaskCell from './MetamaskCell';

const HeaderText = styled.div`
  font-family: Helvetica;
  font-size: 20pt;
  text-align: center;
  color: black;
`;

@inject('syndicateStore', 'ethereumStore')
@observer
export default class Home extends React.Component <{
  syndicateStore?: SyndicateStore,
  ethereumStore?: EthereumStore
}> {

  render() {
    return (
      <>
        <Header />
        <Container>
          <ContractInfo />
          {
            this.props.ethereumStore.authenticated()
            ?
            (
              <>
                <BalanceCell address={this.props.ethereumStore.activeAddress} />
                <CreatePayment />
              </>
            )
            :
            <MetamaskCell />
          }
          <HeaderText>
            Payments
          </HeaderText>
          <div>
            {[...this.props.syndicateStore.payments].reverse().map((payment, i) => {
              return (
                <PaymentCell payment={payment} key={i} />
              );
            })}
          </div>
          <Footer />
        </Container>
      </>
    );
  }
}
