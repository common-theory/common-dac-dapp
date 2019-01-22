export interface IVector2D {
  x: number;
  y: number;
}

export default class Vector2D implements IVector2D {
  x: number = 0;
  y: number = 0;

  /**
   * The scalar magnitude of the vector.
   **/
  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Initialize a Vector2D object.
   *
   * Vector2D properties are all getters, except for x, and y. It implements
   * IVector2D for use in static functions.
   *
   * Vector2D objects can be initialized on top of each other at minimal cost
   * e.g.
   *
   * const vector = new Vector2D({ x: 20, y: 40, });
   *
   * function doMyThing(vector: IVector2D) {
   *   const _vector = new Vector2D(vector);
   * }
   *
   * @param IVector2D|Vector2D coords The initial x and y coordinates.
   **/
  constructor(coords: (Vector2D | IVector2D) = { x: 0, y: 0 }) {
    this.x = coords.x;
    this.y = coords.y;
  }

  static divide(...args: (Vector2D | IVector2D)[]): Vector2D {
    if (args.length === 0) return new Vector2D({ x: 0, y: 0 });
    const quotient = args.shift();
    for (let vector of args) {
      quotient.x /= vector.x;
      quotient.y /= vector.y;
    }
    return new Vector2D(quotient);
  }

  static multiply(...args: (Vector2D | IVector2D | number)[]): Vector2D {
    const product = {
      x: 1,
      y: 1,
    } as IVector2D;
    for (let vector of args) {
      if (typeof vector === 'number') {
        product.x *= vector;
        product.y *= vector;
      } else {
        product.x *= vector.x;
        product.y *= vector.y;
      }
    }
    return new Vector2D(product);
  }

  /**
   * Sum any vectors or numbers provided. Numbers are applied to both axes.
   **/
  static sum(...args: (Vector2D | IVector2D | number)[]): Vector2D {
    const sum = {
      x: 0,
      y: 0,
    } as IVector2D;
    for (let vector of args) {
      if (typeof vector === 'number') {
        sum.x += vector;
        sum.y += vector;
      } else {
        sum.x += vector.x;
        sum.y += vector.y;
      }
    }
    return new Vector2D(sum);
  }

  /**
   * Project a scalar value into a two dimensional vector given an angle in
   * radians.
   **/
  static projectScalarTo2D = (value: number, angle: number) => {
    return new Vector2D({
      y: Math.cos(angle) * value,
      x: Math.sin(angle) * value,
    });
  }

  /**
   * Get the angle between two entities.
   **/
  static angle(point1: IVector2D, point2: IVector2D) {
    const TWO_PI = 2 * Math.PI;
    return (Math.atan2(point2.x - point1.x, point2.y - point1.y) + 2 * TWO_PI) % (TWO_PI);
  }

  static distance(point1: IVector2D, point2: IVector2D): IVector2D {
    return new Vector2D({
      x: point2.x - point1.x,
      y: point2.y - point1.y,
    });
  }

  static distanceScalar(point1: IVector2D, point2: IVector2D): number {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  /**
   * Generate a random number between floor and ceiling.
   **/
  static randomScalar(floor: number = 0, ceiling: number = 500) {
    return Math.floor(Math.random() * (ceiling + -1 * Math.min(floor, 0)) + floor);
  }

  /**
   * Generate a random vector
   * @param {Object} xBounds - An object with floor and ceiling properties to use for the x axis.
   * @param {Object} yBounds - An object with floor and ceiling properties to use for the y axis.
   **/
  static random(v1?: {floor?: number, ceiling?: number}, v2?: {floor?: number, ceiling?: number}) {
    return new Vector2D({
      x: this.randomScalar(v1 && v1.floor, v1 && v1.ceiling),
      y: this.randomScalar(v2 && v2.floor, v2 && v2.ceiling),
    });
  }
}
