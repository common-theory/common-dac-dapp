import React from 'react';
import { observer, inject } from 'mobx-react';
import DACStore from '../stores/DACStore';
import { BlockElement, BlockHeader, BlockFooter } from './Shared';

@inject('dacStore')
@observer
export default class CreateProposal extends React.Component<{ dacStore?: DACStore }> {
  state = {
    updateMember: false,
    ethAddress: '',
    newValue: 0,
    updateContract: false,
    description: ''
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
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Ethereum Address:
                <input
                  name="ethAddress"
                  type="text"
                  value={this.state.ethAddress}
                  onChange={(event) => this.setState({
                    ethAddress: event.target.value
                  })}
                />
              </label>
            </div>
            <div>
              <label>
                New Value:
                <input
                  name="newValue"
                  type="number"
                  value={this.state.newValue}
                  onChange={(event) => this.setState({
                    newValue: event.target.value
                  })}
                />
              </label>
            </div>
            <div>
              <label>
                <div>
                  Additional Info:
                </div>
                <textarea
                  rows={4}
                  cols={50}
                  placeholder="Short description, or ipfs address to longer doc"
                  value={this.state.description}
                  onChange={(event) => this.setState({
                    description: event.target.value
                  })}
                >
                  Any additional information
                </textarea>
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
