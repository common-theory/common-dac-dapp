import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';

@inject('dacStore')
@observer
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          Total Members: {this.props.dacStore.totalVotingMembers}
        </div>
        <div>
          Total Ownership: {this.props.dacStore.totalOwnership}
        </div>
        <div>
          Current Vote Cycle: {this.props.dacStore.currentVoteCycle}
        </div>
      </div>
    );
  }
}
