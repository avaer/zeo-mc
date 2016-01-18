import Immutable from 'immutable';

export default class Vector extends Immutable.Record({
  x: 0,
  y: 0,
  z: 0
}) {
  constructor(x, y, z) {
    x === undefined && (x = 0);
    y === undefined && (y = 0);
    z === undefined && (z = 0);

    super({x, y, z})
  }

  add(b) {
    const a = this;
    return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  multiplyScalar(c) {
    const a = this;
    return new Vector(a.x * c, a.y * c, a.z * c);
  }
}
Vector.bindAdd = a => {
  return b => {
    return b.add(a);
  };
};
