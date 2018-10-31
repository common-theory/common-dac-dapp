import Vector2D, { IVector2D } from './vector2d';

/**
 * A joining point between one or more springs. Rendered as a circle.
 *
 */
export class Connector implements IVector2D {
  x: number;
  y: number;
  position: Vector2D = new Vector2D();
  velocity: Vector2D = new Vector2D();
  maxVelocity: Vector2D = new Vector2D({ x: 50, y: 50 });
  // Return velocity as a value between 0 and 1
  get percentVelocity() {
    return this.velocity.magnitude / this.maxVelocity.magnitude;
  }
  mass: number;
  get isStatic() {
    return this.mass === Infinity;
  }
  springs: Spring[] = [];

  constructor(position: IVector2D = new Vector2D(), _mass: number = 10) {
    this.mass = _mass;
    this.x = position.x;
    this.y = position.y;
  }

  /**
   * Calculate and return the current acceleration of the connector.
   **/
  get appliedAcceleration(): IVector2D {
    const accelerations: IVector2D[] = [];
    for (let spring of this.springs) {
      const otherEntity = spring.connector1 === this ? spring.connector2 : spring.connector1;
      if (!otherEntity) continue;
      const force = spring.force;
      const acceleration = force / this.mass;
      const forceAngle = Vector2D.angle(this, otherEntity);
      const vectorAcceleration = Vector2D.projectScalarTo2D(acceleration, forceAngle);
      accelerations.push(vectorAcceleration);
    }
    return Vector2D.sum(...accelerations);
  }

  /**
   * Step forward by time seconds.
   **/
  step(time: number) {
    if (time > 1) {
      console.log('Warning: Stepping by large time interval will cause inaccurate steps.')
    }
    const acceleration = Vector2D.multiply(this.appliedAcceleration, time);

    this.x += this.velocity.x * time;
    this.y += this.velocity.y * time;
    this.velocity = Vector2D.sum(this.velocity, acceleration);
    if (Math.abs(this.velocity.x) > this.maxVelocity.x) {
      this.velocity.x = this.maxVelocity.x * (this.velocity.x > 0 ? 1 : -1);
    }
    if (Math.abs(this.velocity.y) > this.maxVelocity.y) {
      this.velocity.y = this.maxVelocity.y * (this.velocity.y > 0 ? 1 : -1);
    }
  }

  addSpring(spring: Spring) {
    const i = this.springs.findIndex(_spring => _spring === spring);
    if (i === -1) this.springs.push(spring);
  }

  removeSpring(spring: Spring) {
    const i = this.springs.findIndex(_spring => _spring === spring);
    if (i !== -1) this.springs.splice(i, 1);
  }

  removeAllSprings() {
    for (let spring of this.springs) {
      if (spring.connector1 === this) spring.connector1 = undefined;
      if (spring.connector2 === this) spring.connector2 = undefined;
    }
    this.springs = [];
  }

}

/**
 * Springs simulated using Hooke's Law
 * https://en.wikipedia.org/wiki/Hooke%27s_law
 *
 * A harmonic spring simulation with dampening, for can be calculated like so:
 * force = -(stiffness * (currentLengh - restLength)) - damping * velocity
 **/
export class Spring {
  private _connectors: [Connector?, Connector?] = [];
  stiffness: number;
  restLength: number;
  damping: number;

  constructor(_restLength: (number|[IVector2D, IVector2D]), _stiffness = 0.1, _damping = 0.2) {
    if (Array.isArray(_restLength)) {
      this.restLength = Vector2D.distanceScalar(_restLength[0], _restLength[1]);
    } else {
      this.restLength = _restLength;
    }
    this.stiffness = _stiffness;
    this.damping = _damping;
  }

  get connector1() {
    return this._connectors[0];
  }

  get connector2() {
    return this._connectors[1];
  }

  set connector1(connector: Connector) {
    this.replaceConnector(this.connector1, connector);
  }

  set connector2(connector: Connector) {
    this.replaceConnector(this.connector2, connector);
  }

  /**
   * Perform necessary logic for replacing a connector. This includes
   * modifying the connector springs.
   **/
  private replaceConnector(currentConnector?: Connector, newConnector?: Connector) {
    if (currentConnector) {
      currentConnector.removeSpring(this);
    }
    if (currentConnector === this.connector1) {
      this._connectors[0] = newConnector;
    } else if (currentConnector === this.connector2) {
      this._connectors[1] = newConnector;
    }
    if (newConnector) {
      newConnector.addSpring(this);
    }
  }

  get force() {
    const velocity = Vector2D.sum(this.connector1, this.connector2);
    const currentLength = Vector2D.distanceScalar(this.connector1, this.connector2);
    return (currentLength - this.restLength) * this.stiffness - this.damping * (velocity as Vector2D).magnitude;
  }
}
