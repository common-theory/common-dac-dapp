import React from 'react';
import BN from 'bn.js';
import web3 from 'web3';

export default class WeiDisplay extends React.Component <{
  wei: BN | number | string
}> {
  render() {
    const etherValue = +web3.utils.fromWei(this.props.wei.toString());
    const roundedEtherValue = Math.round(etherValue * 1e5) / 1e5;
    return (
      <>
        {`${roundedEtherValue.toString()} ether`}
      </>
    );
  }
}
