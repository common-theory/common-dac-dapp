import React from 'react';

export interface PieGraphSection {
  value: number,
  fillStyle?: string
  strokeStyle?: string
}

type Props = {
  sections: PieGraphSection[],
  style?: React.CSSProperties,
  radius: number,
};

export default class PieGraph extends React.Component<Props, {}> {
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  get width() {
    return +this.props.radius * 2;
  }

  get height() {
    return +this.width;
  }

  get totalValue() {
    let value = 0;
    for (let section of this.props.sections) {
      value += section.value;
    }
    return +value;
  }

  draw() {
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);

    const TWO_PI = 2 * Math.PI;
    let currentAngle = 0.75 * TWO_PI;
    let _totalValue = this.totalValue;
    const strokeWidth = 2;
    for (let section of this.props.sections) {
      if (+section.value === 0) continue;
      if (Number.isNaN(+section.value)) {
        console.log('encountered NaN section value in PieGraph');
        continue;
      }
      let newAngle = (currentAngle + (section.value / _totalValue) * TWO_PI) % TWO_PI;
      if (section.value == _totalValue) {
        // Ensure the graph renders with 1 section
        newAngle = currentAngle - 1e-4;
      }

      ctx.beginPath();
      ctx.arc(this.width / 2, this.height / 2, this.props.radius - strokeWidth, currentAngle, newAngle);
      ctx.fillStyle = section.fillStyle;
      ctx.strokeStyle = section.strokeStyle || 'black';
      ctx.lineWidth = strokeWidth;
      ctx.fill();
      ctx.stroke();
      currentAngle = newAngle;
    }
  }

  render() {
    return <canvas
      ref={this.canvasRef}
      style={Object.assign({
        margin: '5px',
      }, this.props.style)}
      width={this.width}
      height={this.height}
    />
  }
}