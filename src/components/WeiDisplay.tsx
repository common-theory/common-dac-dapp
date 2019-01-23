import React from 'react';
import BN from 'bn.js';
import web3 from 'web3';
import { inject, observer } from 'mobx-react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';

const GrabSpan = styled.span`
  cursor: pointer;
  margin-bottom: 2px;
  border-bottom: 2px dashed black;
`;

@inject('gdaxStore')
@observer
export default class WeiDisplay extends React.Component <{
  wei: BN | number | string,
  gdaxStore?: any
}> {
  render() {
    const etherValue = +web3.utils.fromWei(this.props.wei.toString());
    const roundedEtherValue = Math.round(etherValue * 1e5) / 1e5;
    const usdValue = Math.round(1e2 * roundedEtherValue * this.props.gdaxStore.ethPrice) / 1e2;
    return (
      <Popup
        trigger={<GrabSpan>{`${roundedEtherValue.toString()} Ether`}</GrabSpan>}
        position="top center"
        on="hover"
      >
        <>
          {`$${usdValue} @ Coinbase`}
        </>
      </Popup>
    );
  }
}
