import React from 'react';
import { observer, inject } from 'mobx-react';
import { BlockContainer, BlockElement, BlockHeader, BlockFooter } from './Shared';

interface ProposedPayment {
  receiver: string,
  weiValue: string,
  time: number
}

@inject()
@observer
export default class CreateProposal extends React.Component<{ }> {
  defaultState = {
    ethAddress: '',
    newValue: 0,
    description: ''
  }
  state = this.defaultState;

  handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // await this.props.dacStore.createProposal(this.state);
    } catch (err) {
      alert('There was a problem creating your proposal');
      console.log(err);
    } finally {
      this.setState(this.defaultState);
    }
  };

  render() {
    return (
      <BlockContainer>
        <BlockHeader>
          Create Proposal
        </BlockHeader>
        <BlockElement>
          <p>
            {`Create a proposal to spend funds.
              Metamask is required for sending the transaction.
              Proposals will appear below and can be voted on during the next cycle.`}
          </p>
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
      </BlockContainer>
    );
  }
}
