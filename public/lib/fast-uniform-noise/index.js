"use strict";

const murmur = require('murmurhash-js');

const floor = Math.floor;
const pow = Math.pow;
const log = Math.log;
const random = Math.random;

const N32 = Math.pow(2, 32);
function uniformHash(s) {
  return murmur(s) / N32;
}

function snapCoordinate(n, snap) {
  return floor(n / snap);
}

function FastUniformNoise(opts) {
  opts = opts || {};

  this._min = opts.min || 0;
  this._max = opts.max || 1;
  this._frequency = opts.frequency || (1 / pow(2, 5));
  this._octaves = opts.octaves || 5;
  this._random = opts.random || random;

  this._seed = null;
}
FastUniformNoise.prototype = {
  getSeed() {
    if (this._seed === null) {
      this._seed = String(this._random());
    }
    return this._seed;
  },

  getNoise(x, y, snap) {
    x = snapCoordinate(x, snap);
    y = snapCoordinate(y, snap);
    const seed = this.getSeed();
    const xs = String(x);
    const ys = String(y);
    const s = seed + ':' + xs + ',' + ys;
    const n = uniformHash(s);
    return n;
  },

  in2D: function(x, y) {
    const scale = log(1 / this._frequency) / log(2);
    x *= scale;
    y *= scale;

    let acc = 1;
    for (let i = 0; i < this._octaves; i++) {
      const snap = pow(2, this._octaves - i);
      const n = this.getNoise(x, y, snap);
      const newFactor = 1 / pow(2, i);
      const oldFactor = 1 - newFactor;
      acc = (acc * oldFactor) + (acc * n * newFactor);
    }

    const v = this._min + (acc * (this._max - this._min));
    return v;
  }
};

module.exports = FastUniformNoise;
