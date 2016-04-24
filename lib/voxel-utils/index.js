"use strict";

class VoxelUtils {
  constructor(opts) {
    this._chunkSize = opts.chunkSize;
  }

  snapCoordinate(n) {
    return Math.abs((this._chunkSize + n % this._chunkSize) % this._chunkSize);
  }

  getIndex(x, y, z) {
    x = this.snapCoordinate(x);
    y = this.snapCoordinate(y);
    z = this.snapCoordinate(z);
    const idx = (x) + (y * this._chunkSize) + (z * this._chunkSize * this._chunkSize);
    return idx;
  }

  getIndexSpec(x, y, z) {
    x = this.snapCoordinate(x);
    y = this.snapCoordinate(y);
    z = this.snapCoordinate(z);
    const idx = (x) + (y * this._chunkSize) + (z * this._chunkSize * this._chunkSize);
    return [x, y, z, idx];
  }

  getIndex2D(x, z) {
    x = this.snapCoordinate(x);
    z = this.snapCoordinate(z);
    const idx = (x) + (z * this._chunkSize);
    return idx;
  }
}

function voxelUtils(opts) {
  return new VoxelUtils(opts);
}

module.exports = voxelUtils;
