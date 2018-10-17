import React from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import DACStore from '../stores/DACStore';

const Container = styled.div`
  padding: 8px;
`;

@inject('dacStore')
@observer
export default class CreateProposal extends React.Component<{ dacStore: DACStore }> {
  state = {
    updateMember: false,
    memberAddress: '',
    newOwnership: 0,
    updateContract: false
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.dacStore.createProposal(this.state);
  };

  render() {
    return (
      <>
        <Header />
        <Container>
          Create a proposal
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Update Member:
                <input
                  name="updateMember"
                  type="checkbox"
                  checked={this.state.updateMember}
                  onChange={(event) => this.setState({
                    updateMember: event.target.checked
                  })} />
              </label>
            </div>
            <div>
              <label>
                Member Address:
                <input
                  name="memberAddress"
                  type="text"
                  value={this.state.memberAddress}
                  onChange={(event) => this.setState({
                    memberAddress: event.target.value
                  })}
                />
              </label>
            </div>
            <div>
              <label>
                New Ownership:
                <input
                  name="newOwnership"
                  type="number"
                  value={this.state.newOwnership}
                  onChange={(event) => this.setState({
                    newOwnership: event.target.value
                  })}
                />
              </label>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </Container>
      </>
    );
  }
}
