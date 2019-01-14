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
  state: {
    paymentChain: Payment[]
  } = {
    paymentChain: []
  };

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

    const start = +this.props.payment.timestamp;
    const now = +new Date() / 1000;
    const end = +this.props.payment.timestamp + +this.props.payment.time;

    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const drawNode = (x: number, y: number, radius: number = 10) => {
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    let currentHeight = canvas.height / 2;
    drawNode(15, currentHeight);
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
      />
    );
  }
}
