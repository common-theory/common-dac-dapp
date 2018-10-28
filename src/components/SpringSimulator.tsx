import React from 'react';

interface Vector2D {
  x: number;
  y: number;
}

class Entity implements Vector2D {
  x: number;
  y: number;
  velocity: Vector2D = { x: 0, y: 0, };
  mass: number;
  get radius() { return 5; }
  springs: Spring[] = [];

  constructor(position: Vector2D = { x: 0, y: 0 }, _mass: number = 10) {
    this.mass = _mass;
    this.x = position.x;
    this.y = position.y;
  }

  /**
   * Calculate and return the current acceleration of the entity.
   **/
  get appliedAcceleration(): Vector2D {
    const accelerations: Vector2D[] = [];
    for (let spring of this.springs) {
      const otherEntity = spring.entity1 === this ? spring.entity2 : spring.entity1;
      if (!otherEntity) continue;
      const currentLength = distanceScalar(this, otherEntity);
      const force = (currentLength - spring.restLength) * spring.stiffness;
      const acceleration = force / this.mass;
      const forceAngle = angle(this, otherEntity);
      const vectorAcceleration = project2D(acceleration, forceAngle);
      const dampedAcceleration = vectorSum(vectorAcceleration, vectorMultiply(this.velocity, spring.damping, -1));
      accelerations.push(dampedAcceleration);
    }
    return vectorSum(...accelerations);
  }

  /**
   * Step forward by time seconds.
   **/
  step(time: number) {
    if (time > 1) {
      console.log('Warning: Stepping by large time interval will cause inaccurate steps.')
    }
    const acceleration = vectorMultiply(this.appliedAcceleration, time);

    this.x += this.velocity.x * time;
    this.y += this.velocity.y * time;
    this.velocity = vectorSum(this.velocity, acceleration);
  }

  addSpring(spring: Spring) {
    const i = this.springs.findIndex(_spring => _spring === spring);
    if (i === -1) this.springs.push(spring);
  }

  removeSpring(spring: Spring) {
    const i = this.springs.findIndex(_spring => _spring === spring);
    if (i !== -1) this.springs.splice(i, 1);
  }

}

// Springs simulated using Hooke's Law
// https://en.wikipedia.org/wiki/Hooke%27s_law
class Spring {
  private _entity1?: Entity;
  private _entity2?: Entity;
  stiffness: number;
  restLength: number;
  damping: number;

  constructor(_restLength: number, _stiffness = 0.1, _damping = 0.08) {
    this.restLength = _restLength;
    this.stiffness = _stiffness;
    this.damping = _damping;
  }

  get entity1() {
    return this._entity1;
  }

  set entity1(entity) {
    if (this._entity1) {
      this._entity1.removeSpring(this);
    }
    this._entity1 = entity;
    this._entity1.addSpring(this);
  }

  get entity2() {
    return this._entity2;
  }

  set entity2(entity) {
    if (this._entity2) {
      this._entity2.removeSpring(this);
    }
    this._entity2 = entity;
    this._entity2.addSpring(this);
  }
}

function vectorDivide(...args: Vector2D[]) {
  if (args.length === 0) return { x: 0, y: 0 };
  const quotient = args.shift();
  for (let vector of args) {
    quotient.x /= vector.x;
    quotient.y /= vector.y;
  }
  return quotient;
}

function vectorMultiply(...args: (Vector2D | number)[]) {
  const product = {
    x: 1,
    y: 1,
  } as Vector2D;
  for (let vector of args) {
    if (typeof vector === 'number') {
      product.x *= vector;
      product.y *= vector;
    } else {
      product.x *= vector.x;
      product.y *= vector.y;
    }
  }
  return product;
}

function vectorMagnitude(vector: Vector2D) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

/**
 * Sum any vectors or numbers provided. Numbers are applied to both axes.
 **/
function vectorSum(...args: (Vector2D | number)[]) {
  const sum = {
    x: 0,
    y: 0,
  } as Vector2D;
  for (let vector of args) {
    if (typeof vector === 'number') {
      sum.x += vector;
      sum.y += vector;
    } else {
      sum.x += vector.x;
      sum.y += vector.y;
    }
  }
  return sum;
}

/**
 * Project a scalar value into a two dimensional vector given an angle in
 * radians.
 **/
function project2D(value: number, angle: number) {
  return {
    y: Math.cos(angle) * value,
    x: Math.sin(angle) * value,
  } as Vector2D;
}

/**
 * Get the angle between two entities.
 **/
function angle(point1: Vector2D, point2: Vector2D) {
  const TWO_PI = 2 * Math.PI;
  return (Math.atan2(point2.x - point1.x, point2.y - point1.y) + 2 * TWO_PI) % (TWO_PI);
}

function distance(point1: Vector2D, point2: Vector2D): Vector2D {
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  } as Vector2D;
}

function distanceScalar(point1: Vector2D, point2: Vector2D): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function randomScalar(floor: number = 0, ceiling: number = 500) {
  return Math.floor(Math.random() * ceiling + floor);
}

function randomVector(v1?: {floor?: number, ceiling?: number}, v2?: {floor?: number, ceiling?: number}) {
  return {
    x: randomScalar(v1 && v1.floor, v1 && v1.ceiling),
    y: randomScalar(v2 && v2.floor, v2 && v2.ceiling),
  } as Vector2D;
}

export default class SpringSimulator extends React.Component <{}, {}> {
  state = {
    width: 0,
    height: 0,
  };
  canvasRef: React.RefObject<HTMLCanvasElement>;

  entities: Entity[] = [];
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
      this.entities.push(new Entity(randomVector({
        floor: -100,
        ceiling: this.canvasRef.current.clientWidth + 100,
      }, {
        floor: -100,
        ceiling: this.canvasRef.current.clientHeight + 100,
      }), randomScalar(10, 100)));
    }
    const mover = new Entity({ x: this.canvasRef.current.clientWidth/2, y: this.canvasRef.current.clientHeight/2 }, Infinity);
    this.entities.push(mover);
    for (let x = 0; x < 500; x++) {
      const index1 = randomScalar(0, this.entities.length);
      const index2 = randomScalar(0, this.entities.length);
      const entity1 = this.entities[index1];
      const entity2 = this.entities[index2];
      const spring = new Spring(distanceScalar(entity1, entity2) + randomScalar(-500, 500), Math.random(), 0.0001);
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
