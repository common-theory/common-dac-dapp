import React from 'react';
import { Payment } from '../stores/Syndicate';
import SyndicateStore from '../stores/Syndicate';
import { inject, observer } from 'mobx-react';

@inject('syndicateStore')
@observer
export default class PaymentGraph extends React.Component<{
  payment: Payment,
  syndicateStore?: SyndicateStore
}> {
  state = {};

  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
      />
    );
  }
}
