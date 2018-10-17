import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 8px;
`;

@inject('dacStore')
@observer
export default class Home extends React.Component {
  state: {} = {
    cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        cycleTimeRemaining: this.props.dacStore.cycleTimeRemaining()
      });
    }, 1000);
  }
  render() {
    return (
      <>
        <Header />
        <Container>
          <div>
            Total Members: {this.props.dacStore.totalVotingMembers}
          </div>
          <div>
            Total Ownership: {this.props.dacStore.totalOwnership}
          </div>
          <div>
            Current Vote Cycle: {this.props.dacStore.currentVoteCycle}
          </div>
          <div>
            Cycle Time Remaining: {this.state.cycleTimeRemaining} seconds
          </div>
        </Container>
      </>
    );
  }
}
