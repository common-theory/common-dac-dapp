import * as Vector from './vectormath';
import Spring from './spring';

export default class Joint implements Vector2D {
  x: number;
  y: number;
  velocity: Vector.Vector2D = { x: 0, y: 0, };
  mass: number;
  get radius() { return 5; }
  springs: Spring[] = [];

  constructor(position: Vector.Vector2D = { x: 0, y: 0 }, _mass: number = 10) {
    this.mass = _mass;
    this.x = position.x;
    this.y = position.y;
  }

  /**
   * Calculate and return the current acceleration of the entity.
   **/
  get appliedAcceleration(): Vector.Vector2D {
    const accelerations: Vector.Vector2D[] = [];
    for (let spring of this.springs) {
      const otherEntity = spring.entity1 === this ? spring.entity2 : spring.entity1;
      if (!otherEntity) continue;
      const currentLength = Vector.distanceScalar(this, otherEntity);
      const force = (currentLength - spring.restLength) * spring.stiffness;
      const acceleration = force / this.mass;
      const forceAngle = Vector.angle(this, otherEntity);
      const vectorAcceleration = Vector.project2D(acceleration, forceAngle);
      const dampedAcceleration = Vector.vectorSum(vectorAcceleration, Vector.vectorMultiply(this.velocity, spring.damping, -1));
      accelerations.push(dampedAcceleration);
    }
    return Vector.vectorSum(...accelerations);
  }

  /**
   * Step forward by time seconds.
   **/
  step(time: number) {
    if (time > 1) {
      console.log('Warning: Stepping by large time interval will cause inaccurate steps.')
    }
    const acceleration = Vector.vectorMultiply(this.appliedAcceleration, time);

    this.x += this.velocity.x * time;
    this.y += this.velocity.y * time;
    this.velocity = Vector.vectorSum(this.velocity, acceleration);
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
