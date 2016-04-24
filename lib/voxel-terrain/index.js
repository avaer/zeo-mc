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
const TERRAIN_FREQUENCY = 1;
const TERRAIN_OCTAVES = 8;
const TERRAIN_DIVISOR = 80;

const DIRT_BOTTOM_THRESHOLD = -255;
const DIRT_BEDROCK_THRESHOLD = -250;
const DIRT_CORE_THRESHOLD = -200;
const DIRT_MANTLE_THRESHOLD = -20;
const DIRT_CRUST_THRESHOLD = 40;
const DIRT_FREQUENCY = 0.02;
const DIRT_OCTAVES = 6;

const SEA_LEVEL = 10;

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

const MAX_TREE_BLOCK_PADDING = 8;
const MAX_VILLAGE_CHUNK_PADDING = 3;

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

  const indevGenerator = indev({
    seed: opts.seed
  });
  const terrainNoise = indevGenerator.simplex({
    min: TERRAIN_FLOOR,
    max: TERRAIN_CEILING,
    frequency: TERRAIN_FREQUENCY,
    octaves: TERRAIN_OCTAVES,
  });

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
    // y: _makeWeatherDensityNoise(),
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

    const riverSurfaces = [];

    generatePoints();
    postProcessPoints();

    function forEachPoint(fn, {padding = 0} = {}) {
      for (let x = startX - padding; x < endX + padding; x++) {
        for (let z = startZ - padding; z < endZ + padding; z++) {
          fn(x, z);
        }
      }
    }

    function forEachChunk(fn, {padding = 0} = {}) {
      const startChunkX = floor(startX / chunkSize);
      const endChunkX = floor(endX / chunkSize);
      const startChunkZ = floor(startZ / chunkSize);
      const endChunkZ = floor(endZ / chunkSize);
      for (let chunkX = startChunkX - padding; chunkX < endChunkX + padding; chunkX++) {
        for (let chunkZ = startChunkZ - padding; chunkZ < endChunkZ + padding; chunkZ++) {
          fn(chunkX, chunkZ);
        }
      }
    }

    function generatePoints() {
      generatePointsInside();
      generatePointsBlockPadded();
      generatePointsChunkPadded();
    }

    function generatePointsInside() {
      forEachPoint((x, z) => {
        let h = floor(terrainNoise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR));
        if (h === TERRAIN_FLOOR || (h >= startY && h < endY)) {
          genLand(x, h, z);
          genDirt(x, h, z);
          genRivers(x, h, z);
          if (!isRiverSurface(x, h, z) && !isCaveSurface(x, h, z)) {
            genVegetation(x, h, z);
            genEntities(x, h, z);
            genWeather(x, h, z);
            genEffects(x, h, z);
          }
        } else if (startY < 0) {
          h = endY;

          genDirt(x, h, z);
          genRivers(x, h, z);
        }
      });
    }

    function generatePointsBlockPadded() {
      forEachPoint((x, z) => {
        let h = floor(terrainNoise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR)); // XXX integrate TERRAIN_DIVISOR into terrainNoise frequency
        if ((h === TERRAIN_FLOOR) || (h >= startY && h < endY) || (startY === chunkSize)) { // always generate when chunkY === 1 to render treetops
          if (!isRiverSurface(x, h, z) && !isCaveSurface(x, h, z)) {
            genTrees(x, h, z);
          }
        }
      }, {padding: MAX_TREE_BLOCK_PADDING});
    }

    function generatePointsChunkPadded() {
      forEachChunk((chunkX, chunkZ) => {
        const villageChunkNoiseN = villageChunkNoise.in2D(chunkX, chunkZ); // XXX villageChunkNoise
        if (villageChunkNoiseN < VILLAGE_RATE) { // XXX VILLAGE_RATE
          const villageWellNoiseXN = villageWellNoiseX.in2D(chunkX, chunkZ);
          const villageWellX = startX + floor(villageWellNoiseXN * chunkSize) + WELL_OFFSET_X; // XXX WELL_OFFSET_X = -2;
          const villageWellNoiseZN = villageWellNoiseZ.in2D(chunkX, chunkZ);
          const villageWellZ = startZ + floor(villageWellNoiseZN * chunkSize) + WELL_OFFSET_Z; // XXX WELL_OFFSET_Z = 0;
          // XXX ensure there is room for the well before trying to make it
          VILLAGES.makeBuilding({ // XXX implement this
            type: 'well',
            position: [villageWellX, villageWellZ],
            onPoint: setVoxelInside
          });
          // XXX generate worms and additional buildings in NEWS directions
        }
      }, {padding: MAX_VILLAGE_CHUNK_PADDING});
    }

    function postProcessPoints() {
      postRivers();
    }

    function genLand(x, y, z) {
      if (!isRiverSurface(x, y, z) && !isCaveSurface(x, y, z)) {
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

      for (let y = startY; y < h; y++) {
        if (y < coreThreshold || !isCave(x, y, z)) {
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
          }

          if (y === h && material === WATER_VALUE && startY <= SEA_LEVEL && endY > SEA_LEVEL) {
            riverSurfaces.push([x, h, z]);
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
      const treeNoiseN = treeNoise.in2D(x, z);
      if (treeNoiseN >= (1 - TREE_RATE)) {
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

    function genEffects(x, h, z) {
      const y = h + 1;
      const effectNoiseN = effectNoise.in2D(x, z);
      if (effectNoiseN < EFFECT_RATE) {
        const effectTypeNoiseN = effectTypeNoise.in2D(x, z);
        const effect = floor(effectTypeNoiseN * EFFECTS.length) + 1;
        setEffect(x, y, z, effect);
      }
    }

    function getRiverNoise(x, y, z) {
      const riverNoiseN2D = riverNoise.in2D(x, z);
      const riverNoiseN3D = riverNoise.in3D(x, y, z);
      const riverNoiseN = sqrt(pow(riverNoiseN2D, 2 * RIVER_HORIZONTAL_FACTOR) * pow(riverNoiseN3D, 2 * (1 - RIVER_HORIZONTAL_FACTOR)));
      return riverNoiseN;
    }

    function isRiver(x, y, z) {
      const riverNoiseN = getRiverNoise(x, y, z);
      return riverNoiseN < RIVER_RATE;
    }
    function isRiverSurface(x, h, z) {
      return isRiver(x, h, z);
    }

    function isCave(x, y, z) {
      const caveNoiseN = caveNoise.in3D(x, y, z);
      return caveNoiseN < CAVE_RATE;
    }
    function isCaveSurface(x, h, z) {
      return isCave(x, h, z);
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
