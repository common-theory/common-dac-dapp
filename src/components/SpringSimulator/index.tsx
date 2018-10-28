/**
 * This is a small module for simulating joints connecting springs.
 *
 *
 **/

import React from 'react';
import Joint from './joint';
import Spring from './spring';
import * as Vector from './vectormath';

export default class SpringSimulator extends React.Component <{}, {}> {
  state = {
    width: 0,
    height: 0,
  };
  canvasRef: React.RefObject<HTMLCanvasElement>;

  entities: Joint[] = [];
  springs: Spring[] = [];
  drawing: boolean;
  lastStep: number = 0;
  _timer: any;

  constructor(props: {}) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    const width = this.canvasRef.current.clientWidth;
    const height = this.canvasRef.current.clientHeight;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    for (let x = 0; x < 100; x++) {
      this.entities.push(new Joint(Vector.randomVector({
        floor: -100,
        ceiling: this.canvasRef.current.clientWidth + 100,
      }, {
        floor: -100,
        ceiling: this.canvasRef.current.clientHeight + 100,
      }), Vector.randomScalar(10, 100)));
    }
    const mover = new Joint({ x: this.canvasRef.current.clientWidth/2, y: this.canvasRef.current.clientHeight/2 }, Infinity);
    this.entities.push(mover);
    for (let x = 0; x < 500; x++) {
      const index1 = Vector.randomScalar(0, this.entities.length);
      const index2 = Vector.randomScalar(0, this.entities.length);
      const entity1 = this.entities[index1];
      const entity2 = this.entities[index2];
      const spring = new Spring(Vector.distanceScalar(entity1, entity2) + Vector.randomScalar(-500, 500), Math.random(), 0.0001);
      spring.entity1 = entity1;
      spring.entity2 = entity2;
      this.springs.push(spring);
    }
    this.startSimulating();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      width: this.canvasRef.current.clientWidth,
      height: this.canvasRef.current.clientHeight,
    });
  };

  startSimulating = () => {
    if (this._timer) {
      clearInterval(this._timer);
    }
    this._timer = setInterval(this.draw, 1000 / 60);
  }

  stopSimulating = () => {
    if (!this._timer) return;
    clearInterval(this._timer);
    delete this._timer;
  }

  draw = () => {
    const currentMs = performance.now();
    if (this.lastStep === 0) {
      this.lastStep = currentMs;
      return;
    }
    const time = (currentMs - this.lastStep) / 1000;
    const MAX_STEP_TIME = 0.02;
    let _scratchTime = time;
    while (_scratchTime > 0) {
      const stepTime = _scratchTime < MAX_STEP_TIME ? _scratchTime : MAX_STEP_TIME;
      for (let entity of this.entities) {
        entity.step(stepTime);
      }
      _scratchTime -= stepTime;
    }
    this.lastStep = currentMs;

    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    for (let spring of this.springs) {
      ctx.beginPath();
      if (spring.entity1 && spring.entity2) {
        ctx.moveTo(spring.entity1.x, spring.entity1.y);
        ctx.lineTo(spring.entity2.x, spring.entity2.y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
      }
    }
    for (let entity of this.entities) {
      ctx.beginPath();
      ctx.arc(entity.x, entity.y, entity.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }

  render() {
    return (
      <canvas style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'blue',
        zIndex: -1
      }} ref={this.canvasRef} width={this.state.width} height={this.state.height} />
    );
  }
}
