export interface Vector2D {
  x: number;
  y: number;
}

export function vectorDivide(...args: Vector2D[]) {
  if (args.length === 0) return { x: 0, y: 0 };
  const quotient = args.shift();
  for (let vector of args) {
    quotient.x /= vector.x;
    quotient.y /= vector.y;
  }
  return quotient;
}

export function vectorMultiply(...args: (Vector2D | number)[]) {
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

export function vectorMagnitude(vector: Vector2D) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

/**
 * Sum any vectors or numbers provided. Numbers are applied to both axes.
 **/
export function vectorSum(...args: (Vector2D | number)[]) {
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
export function project2D(value: number, angle: number) {
  return {
    y: Math.cos(angle) * value,
    x: Math.sin(angle) * value,
  } as Vector2D;
}

/**
 * Get the angle between two entities.
 **/
export function angle(point1: Vector2D, point2: Vector2D) {
  const TWO_PI = 2 * Math.PI;
  return (Math.atan2(point2.x - point1.x, point2.y - point1.y) + 2 * TWO_PI) % (TWO_PI);
}

export function distance(point1: Vector2D, point2: Vector2D): Vector2D {
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  } as Vector2D;
}

export function distanceScalar(point1: Vector2D, point2: Vector2D): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function randomScalar(floor: number = 0, ceiling: number = 500) {
  return Math.floor(Math.random() * ceiling + floor);
}

export function randomVector(v1?: {floor?: number, ceiling?: number}, v2?: {floor?: number, ceiling?: number}) {
  return {
    x: randomScalar(v1 && v1.floor, v1 && v1.ceiling),
    y: randomScalar(v2 && v2.floor, v2 && v2.ceiling),
  } as Vector2D;
}
