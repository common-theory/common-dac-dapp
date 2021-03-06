import React from 'react';
import { inject, observer } from 'mobx-react';
import EthereumStore from '../stores/Ethereum';
import { DarkLink } from './Shared';

@inject('ethereumStore')
@observer
export default class AddressDisplay extends React.Component<{
  address: string,
  ethereumStore?: EthereumStore
}> {
  render() {
    const DISPLAY_LENGTH = 7;
    const formatted = this.props.address.indexOf('0x') === 0
      ? this.props.address.slice(0, DISPLAY_LENGTH)
      : this.props.address.slice(2, DISPLAY_LENGTH + 2);
    return (
      <DarkLink href={this.props.ethereumStore.etherscanUrl(this.props.address)} target="_blank">
        {formatted}
      </DarkLink>
    );
  }
}
