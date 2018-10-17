import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import About from './About';
import EthStore from './EthStore';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const stores = {
  ethStore: new EthStore()
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
