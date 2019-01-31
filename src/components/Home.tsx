import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import { Container } from './Shared';
import SyndicateCell from './SyndicateCell';
import PaymentCell from './PaymentCell';
import SyndicateStore from '../stores/Syndicate';
import Footer from './Footer';
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
          {
            this.props.ethereumStore.authenticated()
            ?
            null
            :
            <MetamaskCell />
          }
          <SyndicateCell />
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
