import Joint from './joint';

// Springs simulated using Hooke's Law
// https://en.wikipedia.org/wiki/Hooke%27s_law

export default class Spring {
  // Make these getters connecting an array to simplify logic below?
  private _joint1?: Joint;
  private _joint2?: Joint;
  stiffness: number;
  restLength: number;
  damping: number;

  constructor(_restLength: number, _stiffness = 0.1, _damping = 0.08) {
    this.restLength = _restLength;
    this.stiffness = _stiffness;
    this.damping = _damping;
  }

  get entity1() {
    return this._joint1;
  }

  set entity1(entity) {
    if (this._joint1) {
      this._joint1.removeSpring(this);
    }
    this._joint1 = entity;
    this._joint1.addSpring(this);
  }

  get entity2() {
    return this._joint2;
  }

  set entity2(entity) {
    if (this._joint2) {
      this._joint2.removeSpring(this);
    }
    this._joint2 = entity;
    this._joint2.addSpring(this);
  }
}
