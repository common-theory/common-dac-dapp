import Web3 from 'web3';
/**
 * Initialize a global web3 from metamask or from a fallback source.
 **/
if (typeof web3 !== 'undefined') {
  global.web3 = new Web3(web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  global.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.commontheory.io'));
}

import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import About from './components/About';
import EthStore from './stores/EthStore';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DACStore from './stores/DACStore';
import CreateProposal from './components/CreateProposal';
import SpringSimulator from './components/SpringSimulator';

const stores = {
  ethStore: new EthStore(),
  dacStore: new DACStore()
};

ReactDOM.render(
  <>
    <Provider { ...stores }>
      <Router>
        <>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/create" component={CreateProposal} />
        </>
      </Router>
    </Provider>
    <SpringSimulator />
  </>,
  document.getElementById('app')
);
