import React from 'react';
import BN from 'bn.js';
import web3 from 'web3';

export default class WeiDisplay extends React.Component <{
  wei: BN | number | string
}> {
  render() {
    return (
      <>
        {`${web3.utils.fromWei(this.props.wei.toString()).toString()} ether`}
      </>
    );
  }
}
