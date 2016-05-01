"use strict";

const indev = require('indev');

const voxelUtils = require('../voxel-utils/index');

const metadata = require('../../metadata/index');
const BLOCKS = metadata.BLOCKS.BLOCKS;
const TREES = metadata.TREES;
const VILLAGES = metadata.VILLAGES;
const VEGETATIONS = metadata.PLANES.VEGETATIONS;
const WEATHERS = metadata.PLANES.WEATHERS;
const EFFECTS = metadata.PLANES.EFFECTS;
const ENTITIES = metadata.MODELS.ENTITIES;

const TERRAIN_FLOOR = 0;
const TERRAIN_CEILING = 20; // minecraft's limit
const TERRAIN_FREQUENCY = 1 / 80;
const TERRAIN_OCTAVES = 8;

const DIRT_BOTTOM_THRESHOLD = -255;
const DIRT_BEDROCK_THRESHOLD = -250;
const DIRT_CORE_THRESHOLD = -200;
const DIRT_MANTLE_THRESHOLD = -20;
const DIRT_CRUST_THRESHOLD = 40;
const DIRT_FREQUENCY = 0.02;
const DIRT_OCTAVES = 6;

const TREE_TYPE_NOISE_FREQUENCY = 0.0004;
const TREE_TYPE_NOISE_OCTAVES = 4;

const RIVER_FREQUENCY = 0.01;
const RIVER_OCTAVES = 8;
const RIVER_RATE = 0.3;
const SHORE_RATE = 0.1;

const RIVER_TYPE_FREQUENCY = 0.0004;
const RIVER_TYPE_OCTAVES = 2;

const RIVER_SAND_RATES = {
  'sand': 1,
  'gravel': 0.25,
  'red_sand': 0.25,
  'dirt': 0.25,
};
const RIVER_SAND_THRESHOLDS = (() => {
  const result = [];
  let total = 0;
  for (let k in RIVER_SAND_RATES) {
    const v = RIVER_SAND_RATES[k];
    total += v;
  }
  let acc = 0;
  for (let k in RIVER_SAND_RATES) {
    const v = RIVER_SAND_RATES[k];
    acc += v;

    const threshold = {
      value: BLOCKS[k],
      threshold: acc / total
    };
    result.push(threshold);
  }
  return result;
})();

const RIVER_HORIZONTAL_FACTOR = 0.55;
const RIVER_SURFACE_MEDIAN_FACTOR = 0.5;

const CAVE_FREQUENCY = 0.02;
const CAVE_OCTAVES = 12;
const CAVE_RATE = 0.3;

const VEGETATION_FREQUENCY = 0.1;
const VEGETATION_OCTAVES = 10;
const VEGETATION_TYPE_FREQUENCY = 0.0005;
const VEGETATION_TYPE_OCTAVES = 2;
const VEGETATION_RATE = 0.3;

const ENTITY_FREQUENCY = 0.05;
const ENTITY_OCTAVES = 8;
const ENTITY_TYPE_FREQUENCY = 0.05;
const ENTITY_TYPE_OCTAVES = 2;
const ENTITY_RATE = 0.16;

const WEATHER_FREQUENCY = 0.001;
const WEATHER_OCTAVES = 2;
const WEATHER_RATE = 0.3;
const WEATHER_TYPE_FREQUENCY = 0.02;
const WEATHER_TYPE_OCTAVES = 2;
const WEATHER_DENSITY_FREQUENCY = 1;
const WEATHER_DENSITY_OCTAVES = 4;
const WEATHER_DENSITY = 0.3;

const EFFECT_FREQUENCY = 0.5;
const EFFECT_OCTAVES = 8;
const EFFECT_TYPE_FREQUENCY = 1;
const EFFECT_TYPE_OCTAVES = 1;
const EFFECT_RATE = 0.2;

const TREE_RATE = 0.1;

const BLOCK_PADDING = 8;
const CHUNK_PADDING = 3;

const BEDROCK_VALUE = BLOCKS['bedrock'];
const LAVA_VALUE = BLOCKS['lava_still'];
const OBSIDIAN_VALUE = BLOCKS['obsidian'];
const STONE_VALUE = BLOCKS['stone'];
const DIRT_VALUE = BLOCKS['dirt'];
const GRASS_VALUE = BLOCKS['grass_top_plains'];
const WATER_VALUE = BLOCKS['water_still'];

const FULL_VALUE = 255;

const min = Math.min;
const abs = Math.abs;
const floor = Math.floor;
const sqrt = Math.sqrt;
const pow = Math.pow;

function voxelTerrain(opts) {
  opts = opts || {};
  const chunkSize = opts.chunkSize;
  const vu = voxelUtils({chunkSize});
  const paddedChunkSize = chunkSize + (BLOCK_PADDING * 2);

  const indevGenerator = indev({
    seed: opts.seed
  });
  const terrainNoise = indevGenerator.simplex({
    min: TERRAIN_FLOOR,
    max: TERRAIN_CEILING,
    frequency: TERRAIN_FREQUENCY,
    octaves: TERRAIN_OCTAVES,
  });

  function _makeVillageWellPositionNoise() {
    return indevGenerator.uniform({
      min: 0,
      max: 1,
      frequency: 1,
      octaves: 4,
    });
  }

  const villageChunkNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 10,
    octaves: 2,
  });
  const villageWellPositionNoises = {
    x: _makeVillageWellPositionNoise(),
    z: _makeVillageWellPositionNoise(),
  };

  const treeNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeTypeNoise = indevGenerator.uniform({
    min: 0,
    max: 1,
    frequency: TREE_TYPE_NOISE_FREQUENCY,
    octaves: TREE_TYPE_NOISE_OCTAVES,
  });
  const treeHeightNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeHeightNoise2 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeHeightNoise3 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeBaseNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeBaseNoise2 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeBaseNoise3 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
  });
  const treeTrunkNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
  });
  const treeTrunkNoise2 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
  });
  const treeTrunkNoise3 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
  });
  const treeLeafNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
  });
  const treeEatNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
  });
  const treeEatNoise2 = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
  });

  const crustBedrockNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
  });
  const crustCoreNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
  });
  const crustMantleNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
  });
  const crustCrustNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
  });

  const riverNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: RIVER_FREQUENCY,
    octaves: RIVER_OCTAVES,
  });

  const riverTypeNoise = indevGenerator.uniform({
    min: 0,
    max: 1,
    frequency: RIVER_TYPE_FREQUENCY,
    octaves: RIVER_TYPE_OCTAVES,
  });

  const caveNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: CAVE_FREQUENCY,
    octaves: CAVE_OCTAVES,
  });

  const vegetationNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: VEGETATION_FREQUENCY,
    octaves: VEGETATION_OCTAVES,
  });
  const vegetationTypeNoise = indevGenerator.uniform({
    min: 0,
    max: 1,
    frequency: VEGETATION_TYPE_FREQUENCY,
    octaves: VEGETATION_TYPE_OCTAVES,
  });

  const entityNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: ENTITY_FREQUENCY,
    octaves: ENTITY_OCTAVES,
  });
  const entityTypeNoise = indevGenerator.uniform({
    min: 0,
    max: 1,
    frequency: ENTITY_TYPE_FREQUENCY,
    octaves: ENTITY_TYPE_OCTAVES,
  });

  const weatherNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: WEATHER_FREQUENCY,
    octaves: WEATHER_OCTAVES,
  });
  const weatherTypeNoise = indevGenerator.uniform({
    min: 0,
    max: 1,
    frequency: WEATHER_TYPE_FREQUENCY,
    octaves: WEATHER_TYPE_OCTAVES,
  });

  function _makeWeatherDensityNoise() {
    return indevGenerator.uniform({
      min: 0,
      max: 1,
      frequency: WEATHER_DENSITY_FREQUENCY,
      octaves: WEATHER_DENSITY_OCTAVES,
    });
  }

  const weatherDensityNoise = _makeWeatherDensityNoise();
  const weatherPositionNoises = {
    x: _makeWeatherDensityNoise(),
    z: _makeWeatherDensityNoise()
  };
  const weatherOffsetNoise = _makeWeatherDensityNoise();

  const effectNoise = indevGenerator.simplex({
    min: 0,
    max: 1,
    frequency: EFFECT_FREQUENCY,
    octaves: EFFECT_OCTAVES,
  });
  const effectTypeNoise = indevGenerator.uniform({
    min: 0,
    max: 1,
    frequency: EFFECT_TYPE_FREQUENCY,
    octaves: EFFECT_TYPE_OCTAVES,
  });

  return function generateChunk(position) {
    const startX = position[0] * chunkSize;
    const startY = position[1] * chunkSize;
    const startZ = position[2] * chunkSize;

    const endX = startX + chunkSize;
    const endY = startY + chunkSize;
    const endZ = startZ + chunkSize;

    const voxels = new Uint16Array(chunkSize * chunkSize * chunkSize);
    const depths = new Uint8Array(chunkSize * chunkSize * chunkSize);
    const vegetations = {};
    const weathers = [];
    const effects = {};
    const entities = {};

    const getHeight = (() => {
      let heightMap = null;
      let heightMapIndex = null;

      return (x, z) => {
        if (heightMap === null) {
          heightMap = new Uint16Array(paddedChunkSize * paddedChunkSize);
          heightMapIndex = new Uint8Array(paddedChunkSize * paddedChunkSize);
        }

        const rawX = x - (startX - BLOCK_PADDING);
        const rawZ = z - (startZ - BLOCK_PADDING);
        const idx = vu.getIndexPadded(rawX, rawZ, paddedChunkSize);
        let height;
        if (heightMapIndex[idx] !== 0) {
          height = heightMap[idx];
        } else {
          height = floor(terrainNoise.in2D(x, z));
          heightMap[idx] = height;
          heightMapIndex[idx] = 1;
        }
        return height;
      };
    })();
    const getLand = (() => {
      let landMap = null;
      let landMapIndex = null;

      return (x, z) => {
        if (landMap === null) {
          landMap = new Uint8Array(paddedChunkSize * paddedChunkSize);
          landMapIndex = new Uint8Array(paddedChunkSize * paddedChunkSize);
        }

        const rawX = x - (startX - BLOCK_PADDING);
        const rawZ = z - (startZ - BLOCK_PADDING);
        const idx = vu.getIndexPadded(rawX, rawZ, paddedChunkSize);
        let land;
        if (landMapIndex[idx] !== 0) {
          land = landMap[idx] === 0;
        } else {
          const h = getHeight(x, z);
          const isRiver = getRiverNoise(x, h, z) < RIVER_RATE;
          const isCave = caveNoise.in3D(x, h, z) < CAVE_RATE;
          land = isRiver || isCave;
          if (!land) {
            landMap[idx] = 1;
          }
          landMapIndex[idx] = 1;
        }
        return land;
      };
    })();
    const getTree = (() => {
      let treeMap = null;
      let treeMapIndex = null;

      return (x, z) => {
        if (treeMap === null) {
          treeMap = new Uint8Array(paddedChunkSize * paddedChunkSize);
          treeMapIndex = new Uint8Array(paddedChunkSize * paddedChunkSize);
        }

        const rawX = x - (startX - BLOCK_PADDING);
        const rawZ = z - (startZ - BLOCK_PADDING);
        const idx = vu.getIndexPadded(rawX, rawZ, paddedChunkSize);
        let tree;
        if (treeMapIndex[idx] !== 0) {
          tree = treeMap[idx] !== 0;
        } else {
          const land = getLand(x, z);
          if (land) {
            tree = treeNoise.in2D(x, z) < TREE_RATE;
          } else {
            tree = false;
          }
          if (tree) {
            treeMap[idx] = 1;
          }
          treeMapIndex[idx] = 1;
        }
        return tree;
      };
    })();
    const riverSurfaces = [];

    generatePoints();
    postProcessPoints();

    function forEachPoint(fn, opts) {
      opts = opts || {};
      opts.padding = opts.padding || 0;

      const padding = opts.padding;
      for (let z = startZ - padding; z < endZ + padding; z++) {
        for (let x = startX - padding; x < endX + padding; x++) {
          fn(x, z);
        }
      }
    }

    function forEachChunk(fn, opts) {
      opts = opts || {};
      opts.padding = opts.padding || 0;

      const padding = opts.padding;
      const startChunkX = floor(startX / chunkSize);
      const endChunkX = floor(endX / chunkSize);
      const startChunkZ = floor(startZ / chunkSize);
      const endChunkZ = floor(endZ / chunkSize);
      for (let chunkZ = startChunkZ - padding; chunkZ < endChunkZ + padding; chunkZ++) {
        for (let chunkX = startChunkX - padding; chunkX < endChunkX + padding; chunkX++) {
          fn(chunkX, chunkZ);
        }
      }
    }

    function generatePoints() {
      generatePointsInside();
      generatePointsChunkPadded();
      generatePointsBlockPadded();
    }

    function generatePointsInside() {
      forEachPoint((x, z) => {
        const h = getHeight(x, z);
        if (h === TERRAIN_FLOOR || (h >= startY && h < endY)) {
          genLand(x, h, z);
          genDirt(x, h, z);
          genRivers(x, h, z);
          if (isLand(x, z)) {
            if (!isTree(x, z)) {
              genVegetation(x, h, z);
              genEntities(x, h, z);
              genEffects(x, h, z);
            }

            genWeather(x, h, z);
          }
        } else if (startY < 0) {
          genDirt(x, endY, z);
          genRivers(x, endY, z);
        }
      });
    }

    function generatePointsChunkPadded() {
      /* forEachChunk((chunkX, chunkZ) => {
        VILLAGES.make({
          position: [chunkX, chunkZ],
          getHeight,
          getLand,
          getTree,
          chunkNoise: villageChunkNoise,
          wellNoiseX: villageWellPositionNoises.x,
          wellNoiseZ: villageWellPositionNoises.z,
          onPoint: setVoxelInside,
        });
      }, {padding: CHUNK_PADDING}); */
    }

    function generatePointsBlockPadded() {
      forEachPoint((x, z) => {
        const h = getHeight(x, z);
        if ((h === TERRAIN_FLOOR) || (h >= startY && h < endY) || (startY === chunkSize)) { // always generate when chunkY === 1 to render treetops
          if (isLand(x, z)) {
            genTrees(x, h, z);
          }
        }
      }, {padding: BLOCK_PADDING});
    }

    function postProcessPoints() {
      postRivers();
    }

    function genLand(x, y, z) {
      if (isLand(x, z)) {
        setVoxel(x, y, z, GRASS_VALUE);
      }
    }

    function genDirt(x, h, z) {
      let crustBedrockNoiseN = crustBedrockNoise.in2D(x, z);
      let crustCoreNoiseN = crustCoreNoise.in2D(x, z);
      let crustMantleNoiseN = crustMantleNoise.in2D(x, z);
      let crustCrustNoiseN = crustCrustNoise.in2D(x, z);

      const totalNoiseN = crustBedrockNoiseN + crustCoreNoiseN + crustMantleNoiseN + crustCrustNoiseN;
      crustBedrockNoiseN /= totalNoiseN;
      crustCoreNoiseN /= totalNoiseN;
      crustMantleNoiseN /= totalNoiseN;
      crustCrustNoiseN /= totalNoiseN;

      const bedrockThreshold = DIRT_BOTTOM_THRESHOLD + (crustBedrockNoiseN * (DIRT_BEDROCK_THRESHOLD - DIRT_BOTTOM_THRESHOLD));
      const coreThreshold = DIRT_BEDROCK_THRESHOLD + (crustBedrockNoiseN * (DIRT_CORE_THRESHOLD - DIRT_BEDROCK_THRESHOLD));
      const mantleThreshold = DIRT_CORE_THRESHOLD + (crustBedrockNoiseN * (DIRT_MANTLE_THRESHOLD - DIRT_CORE_THRESHOLD));
      const crustThreshold = DIRT_MANTLE_THRESHOLD + (crustBedrockNoiseN * (DIRT_CRUST_THRESHOLD - DIRT_MANTLE_THRESHOLD));

      for (let y = startY; y <= h; y++) {
        const caveNoiseN = caveNoise.in3D(x, y, z);
        const isCave = caveNoiseN < CAVE_RATE;

        if (y < h) {
          if (y < coreThreshold || !isCave) {
            const material = (() => {
              if (y < bedrockThreshold) {
                return BEDROCK_VALUE;
              } else if (y < coreThreshold) {
                return LAVA_VALUE;
              } else if (y < mantleThreshold) {
                return OBSIDIAN_VALUE;
              } else if (y < crustThreshold) {
                return STONE_VALUE;
              } else {
                return DIRT_VALUE;
              }
            })();

            setVoxel(x, y, z, material);
          }
        }
      }
    }

    function genRivers(x, h, z) {
      for (let y = startY; y <= h; y++) {
        const riverNoiseN = getRiverNoise(x, y, z);

        const material = (() => {
          if (riverNoiseN < RIVER_RATE) {
            return WATER_VALUE;
          } else if (riverNoiseN < (RIVER_RATE * (1 + SHORE_RATE))) {
            const riverTypeNoiseN = riverTypeNoise.in2D(x, z);
            const riverThresholdValue = (() => {
              for (let i = 0; i < RIVER_SAND_THRESHOLDS.length; i++) {
                const riverThreshold = RIVER_SAND_THRESHOLDS[i];
                if (riverTypeNoiseN < riverThreshold.threshold) {
                  return riverThreshold.value;
                }
              }
              return null;
            })();
            if (riverThresholdValue !== null) {
              return riverThresholdValue;
            } else {
              const lastRiverThreshold = RIVER_SAND_THRESHOLDS[RIVER_SAND_THRESHOLDS.length - 1];
              return lastRiverThreshold.value;
            }
          } else {
            return null;
          }
        })();
        if (material !== null) {
          setVoxel(x, y, z, material);

          if (material === WATER_VALUE) {
            setDepth(x, y, z, FULL_VALUE)

            if (y === h && startY === 0) {
              riverSurfaces.push([x, h, z]);
            }
          }
        }
      }
    }

    function postRivers() {
      // XXX coalesce this into pools and smooth individually for each
      const riverSurfacesMedianHeight = riverSurfaces.map(riverSurface => riverSurface[1]).sort()[floor(riverSurfaces.length * RIVER_SURFACE_MEDIAN_FACTOR)];
      for (let i = 0; i < riverSurfaces.length; i++) {
        const riverSurface = riverSurfaces[i];
        const x = riverSurface[0];
        const h = riverSurface[1];
        const z = riverSurface[2];
        for (let y = h; y <= riverSurfacesMedianHeight; y++) {
          setVoxel(x, y, z, WATER_VALUE);
          setDepth(x, y, z, FULL_VALUE);
        }
      }
    }

    function genTrees(x, y, z) {
      if (isTree(x, z)) {
        TREES.make({
          position: [x, y, z],
          typeNoise: treeTypeNoise,
          heightNoise: treeHeightNoise,
          heightNoise2: treeHeightNoise2,
          heightNoise3: treeHeightNoise3,
          baseNoise: treeBaseNoise,
          baseNoise2: treeBaseNoise2,
          baseNoise3: treeBaseNoise3,
          trunkNoise: treeTrunkNoise,
          trunkNoise2: treeTrunkNoise2,
          trunkNoise3: treeTrunkNoise3,
          leafNoise: treeLeafNoise,
          eatNoise: treeEatNoise,
          eatNoise2: treeEatNoise2,
          onPoint: setVoxelInside,
          voxelUtils: vu,
        });
      }
    }

    function genVegetation(x, h, z) {
      const y = h + 1;
      const vegetationNoiseN = vegetationNoise.in2D(x, z);
      if (vegetationNoiseN < VEGETATION_RATE) {
        const vegetationTypeNoiseN = vegetationTypeNoise.in2D(x, z);
        const vegetation = floor(vegetationTypeNoiseN * VEGETATIONS.length) + 1;
        setVegetation(x, y, z, vegetation);
      }
    }

    function genEntities(x, h, z) {
      const y = h + 1;
      const entityNoiseN = entityNoise.in2D(x, z);
      if (entityNoiseN < ENTITY_RATE) {
        const entityTypeNoiseN = entityTypeNoise.in2D(x, z);
        const entity = floor(entityTypeNoiseN * ENTITIES.length) + 1;
        setEntity(x, y, z, entity);
      }
    }

    function genEffects(x, h, z) {
      const y = h + 1;
      const effectNoiseN = effectNoise.in2D(x, z);
      if (effectNoiseN < EFFECT_RATE) {
        const effectTypeNoiseN = effectTypeNoise.in2D(x, z);
        const effect = floor(effectTypeNoiseN * EFFECTS.length) + 1;
        setEffect(x, y, z, effect);
      }
    }

    function genWeather(x, h, z) {
      const y = h + 1;
      const weatherNoiseN = weatherNoise.in2D(x, z);
      if (weatherNoiseN < WEATHER_RATE) {
        const weatherTypeNoiseN = weatherTypeNoise.in2D(x, z);
        const weather = floor(weatherTypeNoiseN * WEATHERS.length) + 1;
        const weatherDensityNoiseN = weatherDensityNoise.in2D(x, z);
        const numPoints = floor(weatherDensityNoiseN * WEATHER_DENSITY * chunkSize);
        for (let i = 0; i < numPoints; i++) {
          const px = x + i / numPoints;
          const pz = z + i / numPoints;
          const weatherPositionNoiseXN = weatherPositionNoises.x.in2D(px, pz);
          // const weatherPositionNoiseYN = weatherPositionNoises.y.in2D(px, pz);
          const weatherPositionNoiseZN = weatherPositionNoises.z.in2D(px, pz);
          const weatherOffsetNoiseN = weatherOffsetNoise.in2D(px, pz);
          setWeather(
            x + weatherPositionNoiseXN,
            y,
            z + weatherPositionNoiseZN,
            weatherOffsetNoiseN,
            weather
          );
        }
      }
    }

    function getRiverNoise(x, y, z) {
      const riverNoiseN2D = riverNoise.in2D(x, z);
      const riverNoiseN3D = riverNoise.in3D(x, y, z);
      const riverNoiseN = sqrt(pow(riverNoiseN2D, 2 * RIVER_HORIZONTAL_FACTOR) * pow(riverNoiseN3D, 2 * (1 - RIVER_HORIZONTAL_FACTOR)));
      return riverNoiseN;
    }

    function isLand(x, z) {
      return getLand(x, z);
    }

    function isTree(x, z) {
      return getTree(x, z);
    }

    function setVoxel(x, y, z, value) {
      const idx = vu.getIndex(x, y, z);
      voxels[idx] = value;
    }

    function setDepth(x, y, z, depth) {
      const idx = vu.getIndex(x, y, z);
      depths[idx] = depth;
    }

    function setVegetation(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      x = idxSpec[0];
      y = idxSpec[1];
      z = idxSpec[2];
      const idx = idxSpec[3];
      vegetations[idx] = [x, y, z, value];
    }

    function setWeather(x, y, z, offset, value) {
      x = vu.snapCoordinate(x);
      y = vu.snapCoordinate(y);
      z = vu.snapCoordinate(z);
      weathers.push([x, y, z, offset, value]);
    }

    function setEffect(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      x = idxSpec[0];
      y = idxSpec[1];
      z = idxSpec[2];
      const idx = idxSpec[3];
      effects[idx] = [x, y, z, value];
    }

    function setEntity(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      x = idxSpec[0];
      y = idxSpec[1];
      z = idxSpec[2];
      const idx = idxSpec[3];
      entities[idx] = [x, y, z, value];
    }

    function isInside(x, y, z) {
      return x >= startX && x < endX &&
        y >= startY && y < endY &&
        z >= startZ && z < endZ;
    }

    function setVoxelInside(x, y, z, value) {
      if (isInside(x, y, z)) {
        const idx = vu.getIndex(x, y, z);
        voxels[idx] = value;
      }
    }

    const dims = [chunkSize, chunkSize, chunkSize];

    return {
      position,
      dims,
      voxels,
      depths,
      vegetations,
      entities,
      weathers,
      effects,
    };
  }
}

module.exports = voxelTerrain;
