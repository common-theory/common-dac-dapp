/**
 * This is a small module for simulating connectors connecting springs.
 **/

import React from 'react';
import { Connector, Spring } from './physics';
import Vector2D from './vector2d';
import { debounce } from 'debounce';
import idx from 'idx';
import Colors from '../Colors';

export default class SpringSimulator extends React.Component <{}, {}> {
  state = {
    width: 0,
    height: 0,
  };
  canvasRef: React.RefObject<HTMLCanvasElement>;

  connectors: Connector[] = [];

  // These getters are probably _real_ inefficient
  get dynamicConnectors() {
    return this.connectors.filter(connector => !connector.isStatic);
  }
  get staticConnectors() {
    return this.connectors.filter(connector => connector.isStatic);
  }

  springs: Spring[] = [];
  drawing: boolean;
  lastStep: number = 0;

  constructor(props: {}) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    const width = this.canvasRef.current.clientWidth * window.devicePixelRatio;
    const height = this.canvasRef.current.clientHeight * window.devicePixelRatio;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.updateDimensions());
    this.updateDimensions(true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateDimensions());
    this.stopSimulating();
  }

  updateDimensions = (forceUpdate?: boolean) => {
    this.setState({
      width: this.canvasRef.current.clientWidth * window.devicePixelRatio,
      height: this.canvasRef.current.clientHeight * window.devicePixelRatio,
    }, () => {
      this.initializeSystem();
      if (forceUpdate) this.initializeSystem.flush();
    });
  };

  initializeSystem = debounce(() => {
    this.initializeSystem.clear();
    this.connectors.forEach(connector => connector.removeAllSprings());
    this.connectors = [];
    this.springs = [];
    this.connectors.push(new Connector({ x: 0, y: 0 }, Infinity));
    this.connectors.push(new Connector({ x: this.state.width, y: 0 }, Infinity));
    this.connectors.push(new Connector({ x: this.state.width, y: this.state.height }, Infinity));
    this.connectors.push(new Connector({ x: 0, y: this.state.height }, Infinity));
    for (let x = 0; x < 50; x++) {
      this.connectors.push(new Connector(Vector2D.random({
        floor: -500,
        ceiling: this.state.width + 500,
      }, {
        floor: -500,
        ceiling: this.state.height + 500,
      }), Vector2D.randomScalar(50, 300)));
    }
    // Connect each to static connectors
    for (let x = 0; x < this.dynamicConnectors.length; x++) {
      const connector1 = this.dynamicConnectors[x];
      for (let y = 0; y < this.staticConnectors.length; y++) {
        const connector2 = this.staticConnectors[y];
        const spring = new Spring([Vector2D.sum(connector1, Vector2D.random()), Vector2D.sum(connector2, Vector2D.random())], Math.random() + 0.2, 0.0001);
        spring.connector1 = connector1;
        spring.connector2 = connector2;
        this.springs.push(spring);
      }
    }
    for (let x = 0; x < this.dynamicConnectors.length; x++) {
      const connector1 = this.dynamicConnectors[x];
      for (let y = 0; y < this.dynamicConnectors.length; y++) {
        if (Math.random() > 0.1) continue;
        const connector2 = this.dynamicConnectors[y];
        const spring = new Spring([Vector2D.sum(connector1, Vector2D.random()), Vector2D.sum(connector2, Vector2D.random())], Math.random() + 0.2, 0.0001);
        spring.connector1 = connector1;
        spring.connector2 = connector2;
        this.springs.push(spring);
      }
    }
    this.startSimulating();
  }, 1000);

  startSimulating = () => {
    if (this.drawing) return;
    this.drawing = true;
    requestAnimationFrame(this.draw);
  }

  stopSimulating = () => {
    this.drawing = false;
  }

  draw = (now: number) => {
    if (this.lastStep === 0) {
      this.lastStep = now;
    }
    const deltaSeconds = (now - this.lastStep) / 1000;
    // console.log(deltaSeconds);
    const time = deltaSeconds > 1 ? 1 : deltaSeconds;
    for (let connector of this.connectors) {
      connector.step(time);
    }
    this.lastStep = now;

    const ctx = this.canvasRef.current.getContext('2d');
    const { width, height } = this.state;

    // Clear the drawing space
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // Then render the springs
    for (let spring of this.springs) {
      // Don't draw if missing a connector, or is a spring with a static connector
      if (!spring.connector1 || !spring.connector2) continue;
      if (idx(spring, _ => _.connector1.isStatic) ||
          idx(spring, _ => _.connector2.isStatic)) continue;

      ctx.beginPath();
      ctx.moveTo(spring.connector1.x, spring.connector1.y);
      ctx.lineTo(spring.connector2.x, spring.connector2.y);

      ctx.strokeStyle = Colors.gray;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Finally the nodes
    for (let connector of this.connectors) {
      // Don't draw the static connectors
      if (connector.isStatic) continue;
      ctx.beginPath();
      ctx.arc(connector.x, connector.y, 5, 0, 2 * Math.PI);

      // Let's vary the alpha with velocity
      // const min = 0.2;
      // const max = 0.6;
      // And let's invert it, so as it goes faster it gets less visible
      // const alpha = min + (max - min) * (1 - connector.velocity.magnitude / connector.maxVelocity.magnitude)
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(0, 0, width, height);

    if (this.drawing) {
      requestAnimationFrame(this.draw);
    }
  }

  render() {
    return (
      <canvas
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: -10
        }}
        ref={this.canvasRef}
        width={this.state.width}
        height={this.state.height}
      />
    );
  }
}
