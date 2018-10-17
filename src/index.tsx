import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import About from './components/About';
import EthStore from './stores/EthStore';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Web3 from 'web3';
import DACStore from './stores/DACStore';

/**
 * Initialize a global web3 from metamask or from a fallback source.
 **/
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://commontheory.io:4545"));
}

const stores = {
  ethStore: new EthStore(),
  dacStore: new DACStore()
};

ReactDOM.render(
  <Provider { ...stores }>
    <Router>
      <>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </>
    </Router>
  </Provider>,
  document.getElementById('app')
);
