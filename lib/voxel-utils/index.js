"use strict";

const BitBuffer = require('bit-buffer');
const BitView = BitBuffer.BitView;

const constants = require('../../constants/index');
const BLOCK_METADATA_BYTES = constants.BLOCK_METADATA_BYTES;

const ceil = Math.ceil;
const log = Math.log;

const MODEL_BITS = _numBitsRequired(2048);
const DIRECTION_BITS = _numBitsRequired(6);
const DEPTH_BITS = _numBitsRequired(256);

const TOTAL_BITS = MODEL_BITS + DIRECTION_BITS + DEPTH_BITS;
if (TOTAL_BITS > BLOCK_METADATA_BYTES * 8) {
  throw new Error('not enough block metadata bytes');
}

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

  getBlockMetadata(buffer, index) {
    const bitView = new BitView(buffer);
    const model = bitView.getBits(0, MODEL_BITS);
    const direction = bitView.getBits(0 + MODEL_BITS, DIRECTION_BITS);
    const depth = bitView.getBits(0 + MODEL_BITS + DIRECTION_BITS, DEPTH_BITS);
    return {model, direction, depth};
  }

  setBlockMetadata(buffer, index, metadata) {
    metadata = metadata || {};
    const model = metadata.model || 0;
    const direction = metadata.model || 0;
    const depth = metadata.depth || 0;

    const bitView = new BitView(buffer);
    bitView.setBits(0, model, MODEL_BITS);
    bitView.setBits(0 + MODEL_BITS, direction, DIRECTION_BITS);
    bitView.setBits(0 + MODEL_BITS + DIRECTION_BITS, depth, DEPTH_BITS);
  }

  mergeBlockMetadata(buffer, index, metadata) {
    const bitView = new BitView(buffer);
    if ('model' in metadata) {
      const model = metadata.model || 0;
      bitView.setBits(0, model, MODEL_BITS);
    }
    if ('direction' in metadata) {
      const direction = metadata.direction || 0;
      bitView.setBits(0 + MODEL_BITS, direction, DIRECTION_BITS);
    }
    if ('depth' in metadata) {
      const depth = metadata.depth || 0;
      bitView.setBits(0 + MODEL_BITS + DIRECTION_BITS, depth, DEPTH_BITS);
    }
  }

  clearBlockMetadata(buffer, index) {
    const bitView = new BitView(buffer);
    bitView.setBits(0, 0, MODEL_BITS);
    bitView.setBits(0 + MODEL_BITS, 0, DIRECTION_BITS);
    bitView.setBits(0 + MODEL_BITS + DIRECTION_BITS, 0, DEPTH_BITS);
  }
}

function _numBitsRequired(n) {
  return ceil(log(n) / log(2));
}

function voxelUtils(opts) {
  return new VoxelUtils(opts);
}

module.exports = voxelUtils;
