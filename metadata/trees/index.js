"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const OAK_MIN_HEIGHT = 4;
const OAK_MAX_HEIGHT = 14;
const OAK_BASE_MIN_RATIO = 0.1;
const OAK_BASE_MAX_RATIO = 0.3;
const OAK_LEAVES_RADIUS_RATIO_MIN = 0.6;
const OAK_LEAVES_RADIUS_RATIO_MAX = 1;
const OAK_LEAVES_EAT_RATIO = 0.1;
const OAK_LOG_VALUE = BLOCKS['log_big_oak'];
const OAK_LEAVES_VALUE = BLOCKS['leaves_big_oak_plains'];

const LEAVES_SIZE = 8;

const min = Math.min;
const max = Math.max;
const floor = Math.floor;
const abs = Math.abs;
const sqrt = Math.sqrt;

const TREES = [
  // oak
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const leafNoise = opts.leafNoise;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = OAK_MIN_HEIGHT + (heightNoiseN * (OAK_MAX_HEIGHT - OAK_MIN_HEIGHT));
    const baseNoiseN = baseNoise.in2D(x, z);
    const base = height * (OAK_BASE_MIN_RATIO + (baseNoiseN * (OAK_BASE_MAX_RATIO - OAK_BASE_MIN_RATIO)));
    const snappedHeight = floor(height);

    function leafPoints(fn) {
      for (let j = -LEAVES_SIZE; j <= LEAVES_SIZE; j++) {
        for (let k = -LEAVES_SIZE; k <= LEAVES_SIZE; k++) {
          if (j === 0 && k === 0) continue;
          fn(j, k);
        }
      }
    }

    const leafN = leafNoise.in2D(x, z);
    const leafRadius = ((height - base) / 2) * (OAK_LEAVES_RADIUS_RATIO_MIN + (leafN * (OAK_LEAVES_RADIUS_RATIO_MAX - OAK_LEAVES_RADIUS_RATIO_MIN)));
    for (let i = 0; i < height; i++) {
      let yi = y + i;
      onPoint(x, yi, z, OAK_LOG_VALUE);

      if (i >= base) {

        leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const yDistance = abs((i - base - 1) - ((height - base) / 2));
          const leafDistance = sqrt(j * j + k * k + yDistance * yDistance);
          if (leafDistance <= leafRadius) {
            const leafEatN = trunkNoise.in3D(xi, yi, zi);
            const leafEatProbability = leafDistance * OAK_LEAVES_EAT_RATIO;
            if (leafEatN > leafEatProbability) {
              onPoint(xi, yi, zi, OAK_LEAVES_VALUE);
            }
          }
        });
      }
    }

    const yi = y + snappedHeight;
    onPoint(x, yi, z, OAK_LEAVES_VALUE);
  },
];

function make(opts) {
  const position = opts.position;
  const x = position[0];
  const z = position[2];
  const typeNoise = opts.typeNoise;

  const typeNoiseN = typeNoise.in2D(x, z);
  const type = floor(typeNoiseN * TREES.length);
  const treeFn = TREES[type];
  treeFn(opts);
}

const api = {
  TREES,
  make,
};

module.exports = api;
