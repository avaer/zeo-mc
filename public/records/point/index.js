import Immutable from 'immutable';

export default class Point extends Immutable.Record({
  x: 0,
  y: 0
}) {
  constructor(x, y) {
    x === undefined && (x = 0);
    y === undefined && (y = 0);

    super({x, y})
  }

  add(b) {
    const a = this;
    return new Point(a.x + b.x, a.y + b.y);
  }

  multiplyScalar(c) {
    const a = this;
    return new Point(a.x * c, a.y * c);
  }
}
Point.bindAdd = a => {
  return b => {
    return b.add(a);
  };
};
