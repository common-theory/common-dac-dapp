import React from 'react';
import Header from './Header';
import { observer } from 'mobx-react';

@observer
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>The homepage</div>
      </div>
    );
  }
}
