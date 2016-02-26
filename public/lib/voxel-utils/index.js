const {abs} = Math;

class VoxelUtils {
  constructor({chunkSize}) {
    this.chunkSize = chunkSize;
  }

  snapCoordinate(n) {
    return abs((this.chunkSize + n % this.chunkSize) % this.chunkSize);
  }

  getIndex(x, y, z) {
    x = this.snapCoordinate(x);
    y = this.snapCoordinate(y);
    z = this.snapCoordinate(z);
    const idx = (x) + (y * this.chunkSize) + (z * this.chunkSize * this.chunkSize);
    return idx;
  }

  getIndexSpec(x, y, z) {
    x = this.snapCoordinate(x);
    y = this.snapCoordinate(y);
    z = this.snapCoordinate(z);
    const idx = (x) + (y * this.chunkSize) + (z * this.chunkSize * this.chunkSize);
    return [x, y, z, idx];
  }
}

function voxelUtils(opts) {
  return new VoxelUtils(opts);
}

module.exports = voxelUtils;
