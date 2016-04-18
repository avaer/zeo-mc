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
const OAK_LOG_VALUE = BLOCKS['log_oak'];
const OAK_LEAVES_VALUE = BLOCKS['leaves_oak_plains'];

const SPRUCE_MIN_HEIGHT = 4;
const SPRUCE_MAX_HEIGHT = 14;
const SPRUCE_BASE_MIN_RATIO = 0.1;
const SPRUCE_BASE_MAX_RATIO = 0.3;
const SPRUCE_LEAVES_RADIUS_RATIO_MIN = 0.2;
const SPRUCE_LEAVES_RADIUS_RATIO_MAX = 0.4;
const SPRUCE_LEAVES_RADIUS_VARIANCE_MIN = 0.1;
const SPRUCE_LEAVES_RADIUS_VARIANCE_MAX = 0.4;
const SPRUCE_LEAVES_EAT_RATIO = 0.1;
const SPRUCE_LOG_VALUE = BLOCKS['log_spruce'];
const SPRUCE_LEAVES_VALUE = BLOCKS['leaves_spruce_plains'];

const BIRCH_MIN_HEIGHT = 4;
const BIRCH_MAX_HEIGHT = 20;
const BIRCH_BASE_MIN_RATIO = 0.5;
const BIRCH_BASE_MAX_RATIO = 0.7;
const BIRCH_LEAVES_RADIUS_RATIO_MIN = 0.5;
const BIRCH_LEAVES_RADIUS_RATIO_MAX = 1;
const BIRCH_LEAVES_EAT_RATIO = 0.1;
const BIRCH_LOG_VALUE = BLOCKS['log_birch'];
const BIRCH_LEAVES_VALUE = BLOCKS['leaves_birch_plains'];

const LEAVES_SIZE = 8;

const min = Math.min;
const max = Math.max;
const floor = Math.floor;
const abs = Math.abs;
const sqrt = Math.sqrt;

const TREES = [
  /* // oak
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

    const leafN = leafNoise.in2D(x, z);
    const leafRadius = ((height - base) / 2) * (OAK_LEAVES_RADIUS_RATIO_MIN + (leafN * (OAK_LEAVES_RADIUS_RATIO_MAX - OAK_LEAVES_RADIUS_RATIO_MIN)));
    for (let i = 0; i < height; i++) {
      let yi = y + i;
      onPoint(x, yi, z, OAK_LOG_VALUE);

      if (i >= base) {

        _leafPoints((j, k) => {
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
  }, */

  // spruce
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
    const height = SPRUCE_MIN_HEIGHT + (heightNoiseN * (SPRUCE_MAX_HEIGHT - SPRUCE_MIN_HEIGHT));
    const baseNoiseN = baseNoise.in2D(x, z);
    const base = height * (SPRUCE_BASE_MIN_RATIO + (baseNoiseN * (SPRUCE_BASE_MAX_RATIO - SPRUCE_BASE_MIN_RATIO)));
    const snappedHeight = floor(height);

    const leafN = leafNoise.in2D(x, z);
    const leafRadiusMax = (height - base) * (SPRUCE_LEAVES_RADIUS_RATIO_MIN + (leafN * (SPRUCE_LEAVES_RADIUS_RATIO_MAX - SPRUCE_LEAVES_RADIUS_RATIO_MIN)));
    for (let i = 0; i < height; i++) {
      let yi = y + i;

      const trunkN = leafNoise.in3D(x, yi, z);
      const leafRadiusVariance = SPRUCE_LEAVES_RADIUS_VARIANCE_MIN + (trunkN * (SPRUCE_LEAVES_RADIUS_VARIANCE_MAX - SPRUCE_LEAVES_RADIUS_VARIANCE_MIN));

      if (i >= base) {
        let numLeaves = 0;
        _leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafRadiusScale = 1 - (abs((i - base) - ((height - base) * 0.2)) / (height - base));
          const leafRadius = (leafRadiusScale * leafRadiusMax) * (1 + leafRadiusVariance * ((i % 2) === 0 ? 1 : -1));
          const leafDistance = sqrt(j * j + k * k);
          if (leafDistance <= leafRadius) {
            const leafEatN = trunkNoise.in3D(xi, yi, zi);
            const leafEatProbability = leafDistance * SPRUCE_LEAVES_EAT_RATIO;
            if (leafEatN > leafEatProbability) {
              onPoint(xi, yi, zi, SPRUCE_LEAVES_VALUE);
              numLeaves++;
            }
          }
        });

        const value = numLeaves > 0 ? SPRUCE_LOG_VALUE : SPRUCE_LEAVES_VALUE;
        onPoint(x, yi, z, value);
      } else {
        onPoint(x, yi, z, SPRUCE_LOG_VALUE);
      }
    }

    const yi = y + snappedHeight;
    onPoint(x, yi, z, SPRUCE_LEAVES_VALUE);
  },

  /* // birch
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
    const height = BIRCH_MIN_HEIGHT + (heightNoiseN * (BIRCH_MAX_HEIGHT - BIRCH_MIN_HEIGHT));
    const baseNoiseN = baseNoise.in2D(x, z);
    const base = height * (BIRCH_BASE_MIN_RATIO + (baseNoiseN * (BIRCH_BASE_MAX_RATIO - BIRCH_BASE_MIN_RATIO)));
    const snappedHeight = floor(height);

    const leafN = leafNoise.in2D(x, z);
    const leafRadiusMax = (height - base) * BIRCH_LEAVES_RADIUS_RATIO_MIN + (leafN * (BIRCH_LEAVES_RADIUS_RATIO_MAX - BIRCH_LEAVES_RADIUS_RATIO_MIN));
    for (let i = 0; i < height; i++) {
      let yi = y + i;
      onPoint(x, yi, z, BIRCH_LOG_VALUE);

      if (i >= base) {
        _leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafRadiusScale = 1 - (abs((i - base) - ((height - base) * 0.2)) / (height - base));
          const leafRadius = leafRadiusScale * leafRadiusMax;
          const leafDistance = sqrt(j * j + k * k);
          if (leafDistance <= leafRadius) {
            const leafEatN = trunkNoise.in3D(xi, yi, zi);
            const leafEatProbability = leafDistance * BIRCH_LEAVES_EAT_RATIO;
            if (leafEatN > leafEatProbability) {
              onPoint(xi, yi, zi, BIRCH_LEAVES_VALUE);
            }
          }
        });
      }
    }

    const yi = y + snappedHeight;
    onPoint(x, yi, z, BIRCH_LEAVES_VALUE);
  }, */
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

function _leafPoints(fn) {
  for (let j = -LEAVES_SIZE; j <= LEAVES_SIZE; j++) {
    for (let k = -LEAVES_SIZE; k <= LEAVES_SIZE; k++) {
      if (j === 0 && k === 0) continue;
      fn(j, k);
    }
  }
}

const api = {
  TREES,
  make,
};

module.exports = api;
