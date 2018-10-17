import React from 'react';
import Header from './Header';
import { observer } from 'mobx-react';

@observer
export default class About extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>The about page</div>
      </div>
    );
  }
}
