import React from 'react';
import { Payment } from '../stores/Syndicate';

export default class PaymentGraph extends React.Component<{
  payment: Payment
}> {
  state = {};

  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    if (!this.canvasRef.current) return;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
      />
    );
  }
}
