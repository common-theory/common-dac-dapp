require('./web3');
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import { Provider } from 'mobx-react';
import SpringSimulator from './components/SpringSimulator';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import EthereumStore from './stores/Ethereum';
import SyndicateStore from './stores/Syndicate';
import GDAXStore from './stores/GDAX';
import Colors from './components/Colors';

const ethereumStore = new EthereumStore();
const syndicateStore = new SyndicateStore(4);
web3.eth.net.getId()
  .then((networkId: number) => syndicateStore.reloadContract(networkId));
const gdaxStore = new GDAXStore();
const stores = {
  ethereumStore,
  syndicateStore,
  gdaxStore
};

Object.assign(document.body.style, {
  'margin': 'auto',
  'background-color': '#222',
  'max-width': '900px',
  'font-family': 'Helvetica',
  'color': Colors.gray
});

ReactDOM.render(
  <>
    <Provider { ...stores }>
      <Router>
        <>
          <Route path="/" component={Home} />
        </>
      </Router>
    </Provider>
    <SpringSimulator />
  </>,
  document.getElementById('app')
);
