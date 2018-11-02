/**
 * Color constants
 *
 * https://coolors.co/444444-fce82f-2ec8f7-d81e30-01bf3a
 **/

export default class Colors {
  static red(alpha: number = 1) {
    return `rgba(216, 30, 48, ${alpha})`;
  }

  static black(alpha: number = 1) {
    return `rgba(68, 68, 68, ${alpha})`;
  }

  static yellow(alpha: number = 1) {
    return `rgba(252, 232, 47, ${alpha})`;
  }

  static blue(alpha: number = 1) {
    return `rgba(46, 200, 247, ${alpha})`;
  }

  static green(alpha: number = 1) {
    return `rgba(1, 191, 58, ${alpha})`;
  }
}
