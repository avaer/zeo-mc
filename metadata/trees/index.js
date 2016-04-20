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
const BIRCH_BASE_MIN_RATIO = 0.4;
const BIRCH_BASE_MAX_RATIO = 0.6;
const BIRCH_LEAVES_RADIUS_RATIO_MIN = 0.5;
const BIRCH_LEAVES_RADIUS_RATIO_MAX = 1;
const BIRCH_LEAVES_EAT_RATIO = 0.1;
const BIRCH_LOG_VALUE = BLOCKS['log_birch'];
const BIRCH_LEAVES_VALUE = BLOCKS['leaves_birch_plains'];

const JUNGLE_MIN_HEIGHT = 1;
const JUNGLE_MAX_HEIGHT = 26;
const JUNGLE_CANOPY_RATIO = 0.5;
const JUNGLE_CANOPY_OFFSET_RATIO_MAX = 0.125;
const JUNGLE_CANOPY_RADIUS_RATIO_MIN = 1;
const JUNGLE_CANOPY_RADIUS_RATIO_MAX = 1.5;
const JUNGLE_CANOPY_CAP_RATIO_MIN = 0.2;
const JUNGLE_CANOPY_CAP_RATIO_MAX = 0.4;
const JUNGLE_CANOPY_CAP_MIN = 3;
const JUNGLE_LEAVES_RADIUS_RATIO_MIN = 0.5;
const JUNGLE_LEAVES_RADIUS_RATIO_MAX = 1;
const JUNGLE_LEAVES_EAT_RATIO = 0.1;
const JUNGLE_LOG_VALUE = BLOCKS['log_jungle'];
const JUNGLE_LEAVES_VALUE = BLOCKS['leaves_jungle_plains'];

const ACACIA_MIN_HEIGHT = 4;
const ACACIA_MAX_HEIGHT = 8;
const ACACIA_FORK_MIN_RATIO = 0.4;
const ACACIA_FORK_MAX_RATIO = 0.8;
const ACACIA_FORK_HEIGHT_RATIO_MIN = 0
const ACACIA_FORK_HEIGHT_RATIO_MAX = 1;
const ACACIA_FORK_ANGLE_MIN = 0.5;
const ACACIA_FORK_ANGLE_MAX = 1;
const ACACIA_FORK_HEIGHT_OFFSET_RATIO_MIN = 0.1;
const ACACIA_FORK_HEIGHT_OFFSET_RATIO_MAX = 0.25;
const ACACIA_CANOPY_RADIUS_RATIO_MIN = 1;
const ACACIA_CANOPY_RADIUS_RATIO_MAX = 2.5;
const ACACIA_LEAVES_EAT_RATIO = 0.1;
const ACACIA_LOG_VALUE = BLOCKS['log_acacia'];
const ACACIA_LEAVES_VALUE = BLOCKS['leaves_acacia_plains'];

const DARK_OAK_MIN_HEIGHT = 6;
const DARK_OAK_MAX_HEIGHT = 14;
const DARK_OAK_BASE_MIN_RATIO = 0.4;
const DARK_OAK_BASE_MAX_RATIO = 0.6;
const DARK_OAK_BRANCHES_RADIUS_RATIO_MIN = 0.1;
const DARK_OAK_BRANCHES_RADIUS_RATIO_MAX = 0.2;
const DARK_OAK_BRANCHES_EAT_RATIO = 0.5;
const DARK_OAK_BRANCHES_EAT_SCALE = 0.5;
const DARK_OAK_LEAVES_RADIUS_RATIO_MIN = 0.3;
const DARK_OAK_LEAVES_RADIUS_RATIO_MAX = 0.6;
const DARK_OAK_LEAVES_EAT_RATIO = 0.1;
const DARK_OAK_LOG_VALUE = BLOCKS['log_oak'];
const DARK_OAK_LEAVES_VALUE = BLOCKS['leaves_oak_plains'];

const HUGE_RED_MUSHROOM_MIN_HEIGHT = 4;
const HUGE_RED_MUSHROOM_MAX_HEIGHT = 12;
const HUGE_RED_MUSHROOM_RADIUS_RATIO_MIN = 0.2;
const HUGE_RED_MUSHROOM_RADIUS_RATIO_MAX = 0.4;
const HUGE_RED_MUSHROOM_TRUNK_VALUE = BLOCKS['mushroom_block_skin_stem'];
const HUGE_RED_MUSHROOM_CANOPY_VALUE = BLOCKS['mushroom_block_skin_red'];

const HUGE_BROWN_MUSHROOM_MIN_HEIGHT = 4;
const HUGE_BROWN_MUSHROOM_MAX_HEIGHT = 12;
const HUGE_BROWN_MUSHROOM_RADIUS_RATIO_MIN = 0.4;
const HUGE_BROWN_MUSHROOM_RADIUS_RATIO_MAX = 0.6;
const HUGE_BROWN_MUSHROOM_TRUNK_VALUE = BLOCKS['mushroom_block_skin_stem'];
const HUGE_BROWN_MUSHROOM_CANOPY_VALUE = BLOCKS['mushroom_block_skin_brown'];

const CACTUS_MIN_HEIGHT = 1;
const CACTUS_MAX_HEIGHT = 6;
const CACTUS_TOP_VALUE = BLOCKS['cactus_top'];
const CACTUS_SIDE_VALUE = BLOCKS['cactus_side'];

const LEAVES_SIZE = 8;

const min = Math.min;
const max = Math.max;
const floor = Math.floor;
const ceil = Math.ceil;
const round = Math.round;
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
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
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
      const yi = y + i;
      onPoint(x, yi, z, OAK_LOG_VALUE);

      if (i >= base) {
        _leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const yDistance = abs((i - base - 1) - ((height - base) / 2));
          const leafDistance = sqrt(j * j + k * k + yDistance * yDistance);
          if (leafDistance <= leafRadius) {
            const leafEatN = eatNoise.in3D(xi, yi, zi);
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

  // spruce
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
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
      const yi = y + i;
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
            const leafEatN = eatNoise.in3D(xi, yi, zi);
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

  // birch
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
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
      const yi = y + i;
      onPoint(x, yi, z, BIRCH_LOG_VALUE);

      if (i >= base) {
        const leafRadiusScale = 1 - (abs((i - base) - ((height - base) * 0.2)) / (height - base));
        const leafRadius = leafRadiusScale * leafRadiusMax;

        _leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafDistance = sqrt(j * j + k * k);
          if (leafDistance <= leafRadius) {
            const leafEatN = eatNoise.in3D(xi, yi, zi);
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
  },

  // jungle
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = JUNGLE_MIN_HEIGHT + (heightNoiseN * (JUNGLE_MAX_HEIGHT - JUNGLE_MIN_HEIGHT));
    const snappedHeight = floor(height);

    function makeCanopy(x, y, z, size) {
      const leafN = leafNoise.in3D(x, y, z);
      const leafRadiusMax = size * (JUNGLE_CANOPY_RADIUS_RATIO_MIN + (leafN * (JUNGLE_CANOPY_RADIUS_RATIO_MAX - JUNGLE_CANOPY_RADIUS_RATIO_MIN)));

      for (let i = 0; i < size; i++) {
        const yi = y - size + i;
        const leafRadiusScale = 1 - (abs(i - (size * 0.1)) / size);
        const leafRadius = leafRadiusScale * leafRadiusMax;

        _leafPointsAll((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafDistance = sqrt(j * j + k * k);
          if (leafDistance <= leafRadius) {
            const leafEatN = eatNoise.in3D(xi, yi, zi);
            const leafEatProbability = leafDistance * JUNGLE_LEAVES_EAT_RATIO;
            if (leafEatN > leafEatProbability) {
              onPoint(xi, yi, zi, JUNGLE_LEAVES_VALUE);
            }
          }
        });
      }
    }

    for (let i = 0; i < height - 1; i++) {
      const yi = y + i;

      const trunkNoiseN = trunkNoise.in3D(x, yi, z);
      if (trunkNoiseN < JUNGLE_CANOPY_RATIO) {
        const trunkNoiseNX = trunkNoise2.in3D(x, yi, z);
        const xdRaw = (-1 + trunkNoiseNX * 2) * (height * JUNGLE_CANOPY_OFFSET_RATIO_MAX);
        const xd = floor(abs(xdRaw)) * (xdRaw >= 0 ? 1 : -1);
        const trunkNoiseNZ = trunkNoise3.in3D(x, yi, z);
        const zdRaw = (-1 + trunkNoiseNZ * 2) * (height * JUNGLE_CANOPY_OFFSET_RATIO_MAX);
        const zd = floor(abs(zdRaw)) * (zdRaw >= 0 ? 1 : -1);
        const canopyDistance = sqrt(xd * xd + zd * zd);
        const canopySize = ceil(canopyDistance);
        if (canopySize < i) {
          makeCanopy(x + xd, yi, z + zd, canopySize);
        }
      }
    }

    const yi = y + snappedHeight;
    const topCanopyN = leafNoise.in3D(x, yi, z);
    const topCanopySize = min(
      max(
        floor(height * (JUNGLE_CANOPY_CAP_RATIO_MIN + (topCanopyN * (JUNGLE_CANOPY_CAP_RATIO_MAX - JUNGLE_CANOPY_CAP_RATIO_MIN)))),
        min(snappedHeight, JUNGLE_CANOPY_CAP_MIN)
      ),
      LEAVES_SIZE
    );
    makeCanopy(x, yi, z, topCanopySize)
    // onPoint(x, yi, z, JUNGLE_LEAVES_VALUE);

    for (let i = 0; i < height - 2; i++) {
      const yi = y + i;
      onPoint(x, yi, z, JUNGLE_LOG_VALUE);
    }
  },

  // acacia
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = ACACIA_MIN_HEIGHT + (heightNoiseN * (ACACIA_MAX_HEIGHT - ACACIA_MIN_HEIGHT));
    const snappedHeight = floor(height);
    const forkNoiseN = baseNoise.in2D(x, z);
    const fork = height * (ACACIA_FORK_MIN_RATIO + (forkNoiseN * (ACACIA_FORK_MAX_RATIO - ACACIA_FORK_MIN_RATIO)));
    const snappedFork = floor(fork);
    const forkAxes = (() => {
      const forkAxisN = trunkNoise.in3D(x, y + snappedFork, z);
      if (forkAxisN < 0.25) {
        return [[1, 0], [-1, 0]];
      } else if (forkAxisN < 0.5) {
        return [[-1, 0], [1, 0]];
      } else if (forkAxisN < 0.75) {
        return [[0, 1], [0, -1]];
      } else {
        return [[0, -1], [0, 1]];
      }
    })();
    const forkLeftHeightN = heightNoise2.in3D(x, y + snappedFork, z);
    const forkLeftHeight = fork + (height - fork) * (ACACIA_FORK_HEIGHT_RATIO_MIN + (forkLeftHeightN * (ACACIA_FORK_HEIGHT_RATIO_MAX - ACACIA_FORK_HEIGHT_RATIO_MIN)));
    const snappedForkLeftHeight = floor(forkLeftHeight);
    const forkRightHeightN = heightNoise3.in3D(x, y + snappedFork, z);
    const forkRightHeight = fork + (height - fork) * (ACACIA_FORK_HEIGHT_RATIO_MIN + (forkRightHeightN * (ACACIA_FORK_HEIGHT_RATIO_MAX - ACACIA_FORK_HEIGHT_RATIO_MIN)));
    const snappedForkRightHeight = floor(forkRightHeight);
    const forkLeftAngleN = baseNoise2.in3D(x, y + snappedFork, z);
    const forkLeftAngle = (ACACIA_FORK_ANGLE_MIN + (forkLeftAngleN * (ACACIA_FORK_ANGLE_MAX - ACACIA_FORK_ANGLE_MIN)));
    const forkRightAngleN = baseNoise3.in3D(x, y + snappedFork, z);
    const forkRightAngle = (ACACIA_FORK_ANGLE_MIN + (forkRightAngleN * (ACACIA_FORK_ANGLE_MAX - ACACIA_FORK_ANGLE_MIN)));
    const forkHeightOffsetN = heightNoise.in3D(x, y + snappedFork, z);
    const forkHeightOffset = height * (ACACIA_FORK_HEIGHT_OFFSET_RATIO_MIN + (forkHeightOffsetN * (ACACIA_FORK_HEIGHT_OFFSET_RATIO_MAX - ACACIA_FORK_HEIGHT_OFFSET_RATIO_MIN)))
    const snappedForkHeightOffset = floor(forkHeightOffset);

    function makeCanopy(x, y, z, size) {
      const leafN = leafNoise.in3D(x, y, z);
      const leafRadiusMax = size * (ACACIA_CANOPY_RADIUS_RATIO_MIN + (leafN * (ACACIA_CANOPY_RADIUS_RATIO_MAX - ACACIA_CANOPY_RADIUS_RATIO_MIN)));

      for (let i = 0; i < size; i++) {
        const yi = y - size + i;
        const leafRadiusScale = 1 - (abs(i - (size * 0.2)) / size);
        const leafRadius = leafRadiusScale * leafRadiusMax;

        _leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafDistance = sqrt(j * j + k * k);
          if (leafDistance <= leafRadius) {
            const leafEatN = eatNoise.in3D(xi, yi, zi);
            const leafEatProbability = leafDistance * ACACIA_LEAVES_EAT_RATIO;
            if (leafEatN > leafEatProbability) {
              onPoint(xi, yi, zi, ACACIA_LEAVES_VALUE);
            }
          }
        });
      }
    }

    for (let i = 0; i < height; i++) {
      const yi = y + i;

      if (i < fork) {
        onPoint(x, yi, z, ACACIA_LEAVES_VALUE);
      } else {
        const forkHeight = i - fork;

        const xil = round(x + forkAxes[0][0] * (forkHeight * forkLeftAngle));
        const yil = yi;
        const zil = round(z + forkAxes[0][1] * (forkHeight * forkLeftAngle));
        if (i < snappedForkLeftHeight) {
          onPoint(xil, yil, zil, ACACIA_LEAVES_VALUE);
        } else if (i === snappedForkLeftHeight) {
          const canopySize = round((forkLeftHeight - fork) / 2);
          makeCanopy(xil, yi, zil, canopySize);
        }

        const xir = round(x + forkAxes[1][0] * (forkHeight * forkRightAngle));
        const yir = yi - snappedForkHeightOffset;
        const zir = round(z + forkAxes[1][1] * (forkHeight * forkRightAngle));
        if (i < snappedForkRightHeight) {
          onPoint(xir, yir, zir, ACACIA_LEAVES_VALUE);
        } else if (i === snappedForkRightHeight) {
          const canopySize = round((forkRightHeight - fork) / 2);
          makeCanopy(xir, yir, zir, canopySize);
        }
      }
    }
  }, */

  // dark oak
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = DARK_OAK_MIN_HEIGHT + (heightNoiseN * (DARK_OAK_MAX_HEIGHT - DARK_OAK_MIN_HEIGHT));
    const baseNoiseN = baseNoise.in2D(x, z);
    const base = height * (DARK_OAK_BASE_MIN_RATIO + (baseNoiseN * (DARK_OAK_BASE_MAX_RATIO - DARK_OAK_BASE_MIN_RATIO)));
    const snappedHeight = floor(height);
    const leafN = leafNoise.in2D(x, z);
    const leafRadiusMax = height * (DARK_OAK_LEAVES_RADIUS_RATIO_MIN + (leafN * (DARK_OAK_LEAVES_RADIUS_RATIO_MAX - DARK_OAK_LEAVES_RADIUS_RATIO_MIN)));
    const trunkN = trunkNoise.in2D(x, z);;
    const branchRadiusMax = height * (DARK_OAK_BRANCHES_RADIUS_RATIO_MIN + (trunkN * (DARK_OAK_BRANCHES_RADIUS_RATIO_MAX - DARK_OAK_BRANCHES_RADIUS_RATIO_MIN)));

    for (let i = 0; i < height; i++) {
      const yi = y + i;

      if (i >= base) {
        _leafPointsAll((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafRadiusScale = 1 - (abs((i - base) - (height - base) * 0.2) / ((height - base) * 0.6));
          const leafRadius = leafRadiusScale * leafRadiusMax;
          const jd = j > 0 ? j - 1 : j;
          const kd = k > 0 ? k - 1 : k;
          const leafDistance = sqrt(jd * jd + kd * kd);
          if (leafDistance <= leafRadius) {
            const leafEatN = eatNoise.in3D(xi, yi, zi);
            const leafEatProbability = leafDistance * DARK_OAK_LEAVES_EAT_RATIO;
            if (leafEatN > leafEatProbability) {
              onPoint(xi, yi, zi, DARK_OAK_LEAVES_VALUE);
            }
          }
        });
      }

      _leafPointsAll((j, k) => {
        const xi = x + j;
        const zi = z + k;

        const branchRadiusScale = 1 - (abs(i - base) / ((height - base) * 0.3));
        const branchRadius = branchRadiusScale * branchRadiusMax;
        const jd = j > 0 ? j - 1 : j;
        const kd = k > 0 ? k - 1 : k;
        const branchDistance = sqrt(jd * jd + kd * kd);
        if (branchDistance <= branchRadius) {
          const branchEatN = eatNoise2.in3D(xi, yi, zi);
          const branchEatProbability = branchDistance * DARK_OAK_BRANCHES_EAT_RATIO;
          if (branchEatN > branchEatProbability) {
            onPoint(xi, yi, zi, DARK_OAK_LOG_VALUE);
          }
        }
      });

      if (i < base + 1) {
        _trunkPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;
          onPoint(xi, yi, zi, DARK_OAK_LOG_VALUE);
        });
      }
    }
  },

  // huge red mushroom
  /* function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = HUGE_RED_MUSHROOM_MIN_HEIGHT + (heightNoiseN * (HUGE_RED_MUSHROOM_MAX_HEIGHT - HUGE_RED_MUSHROOM_MIN_HEIGHT));
    const snappedHeight = floor(height);

    for (let i = 0; i < height; i++) {
      const yi = y + i;
      onPoint(x, yi, z, HUGE_RED_MUSHROOM_TRUNK_VALUE);
    }

    const yi = y + snappedHeight;
    const leafN = leafNoise.in3D(x, yi, z);
    const leafRadius = height * (HUGE_RED_MUSHROOM_RADIUS_RATIO_MIN + (leafN * (HUGE_RED_MUSHROOM_RADIUS_RATIO_MAX - HUGE_RED_MUSHROOM_RADIUS_RATIO_MIN)));
    const snappedLeafRadius = floor(leafRadius);
    _leafPointsAll((j, k) => {
      const xi = x + j;
      const zi = z + k;

      const xd = abs(j);
      const zd = abs(k);
      if (xd < leafRadius - 1 && zd < leafRadius - 1) {
        onPoint(xi, yi, zi, HUGE_RED_MUSHROOM_CANOPY_VALUE);
      }
    });
    for (let i = -1; i < snappedLeafRadius; i++) {
      const yi = y + snappedHeight - snappedLeafRadius + i;
      _leafPoints((j, k) => {
        const xd = abs(j);
        const zd = abs(k);
        if (
          (xd <= snappedLeafRadius && zd <= snappedLeafRadius) &&
          (xd === snappedLeafRadius || zd === snappedLeafRadius) &&
          !(xd === snappedLeafRadius && zd === snappedLeafRadius)
        ) {
          const xi = x + j;
          const zi = z + k;
          onPoint(xi, yi, zi, HUGE_RED_MUSHROOM_CANOPY_VALUE);
        }
      });
    }
  },

  // huge brown mushroom
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = HUGE_BROWN_MUSHROOM_MIN_HEIGHT + (heightNoiseN * (HUGE_BROWN_MUSHROOM_MAX_HEIGHT - HUGE_BROWN_MUSHROOM_MIN_HEIGHT));
    const snappedHeight = floor(height);

    for (let i = 0; i < snappedHeight; i++) {
      const yi = y + i;
      onPoint(x, yi, z, HUGE_BROWN_MUSHROOM_TRUNK_VALUE);
    }

    const yi = y + snappedHeight;
    const leafN = leafNoise.in3D(x, yi, z);
    const leafRadius = height * (HUGE_BROWN_MUSHROOM_RADIUS_RATIO_MIN + (leafN * (HUGE_BROWN_MUSHROOM_RADIUS_RATIO_MAX - HUGE_BROWN_MUSHROOM_RADIUS_RATIO_MIN)));
    _leafPointsAll((j, k) => {
      const xi = x + j;
      const zi = z + k;

      const xd = abs(j);
      const zd = abs(k);
      if ((xd < leafRadius - 1 || zd < leafRadius - 1) && (xd < leafRadius && zd < leafRadius)) {
        onPoint(xi, yi, zi, HUGE_BROWN_MUSHROOM_CANOPY_VALUE);
      }
    });
  },

  // cactus
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const heightNoise2 = opts.heightNoise2;
    const heightNoise3 = opts.heightNoise3;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const trunkNoise2 = opts.trunkNoise2;
    const trunkNoise3 = opts.trunkNoise3;
    const leafNoise = opts.leafNoise;
    const eatNoise = opts.eatNoise;
    const eatNoise2 = opts.eatNoise2;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = CACTUS_MIN_HEIGHT + (heightNoiseN * (CACTUS_MAX_HEIGHT - CACTUS_MIN_HEIGHT));
    const snappedHeight = floor(height);

    for (let i = 0; i < snappedHeight; i++) {
      const yi = y + i;
      const value = (i === snappedHeight - 1) ? CACTUS_TOP_VALUE : CACTUS_SIDE_VALUE;
      onPoint(x, yi, z, value);
    }
  }, */

  // XXX logs w/mushrooms: oak, spruce, birch, jungle
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

function _leafPointsAll(fn) {
  for (let j = -LEAVES_SIZE; j <= LEAVES_SIZE; j++) {
    for (let k = -LEAVES_SIZE; k <= LEAVES_SIZE; k++) {
      fn(j, k);
    }
  }
}

function _trunkPoints(fn) {
  fn(0, 0);
  fn(1, 0);
  fn(0, 1);
  fn(1, 1);
}

const api = {
  TREES,
  make,
};

module.exports = api;
