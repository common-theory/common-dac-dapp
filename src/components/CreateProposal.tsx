import React from 'react';
import { observer, inject } from 'mobx-react';
import DACStore from '../stores/DACStore';
import { BlockElement, BlockHeader, BlockFooter } from './Shared';

@inject('dacStore')
@observer
export default class CreateProposal extends React.Component<{ dacStore?: DACStore }> {
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
        <BlockHeader>
          Create Proposal
        </BlockHeader>
        <BlockElement>
          Create a proposal
          <form onSubmit={this.handleSubmit}>
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
        </BlockElement>
        <BlockFooter>
        </BlockFooter>
      </>
    );
  }
}
