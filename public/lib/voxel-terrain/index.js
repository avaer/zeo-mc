import Alea from 'alea';
import FastSimplexNoise from 'fast-simplex-noise';
import FastUniformNoise from '../fast-uniform-noise/index';
import voxelUtils from '../voxel-utils/index';

import * as resources from '../../resources/index';
const BLOCKS = resources.BLOCKS.BLOCKS;
const VEGETATIONS = resources.PLANES.VEGETATIONS;
const WEATHERS = resources.PLANES.WEATHERS;
const EFFECTS = resources.PLANES.EFFECTS;
const ENTITIES = resources.MODELS.ENTITIES;

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
      name: k,
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
const WEATHER_TYPE_FREQUENCY = 0.02;
const WEATHER_TYPE_OCTAVES = 2;
const WEATHER_RATE = 0.3;

const EFFECT_FREQUENCY = 0.5;
const EFFECT_OCTAVES = 8;
const EFFECT_TYPE_FREQUENCY = 1;
const EFFECT_TYPE_OCTAVES = 1;
const EFFECT_RATE = 0.2;

const TREE_RATE = 0.1;
const TREE_MIN_HEIGHT = 4;
const TREE_MAX_HEIGHT = 14;
const TREE_BASE_RATIO = 0.3;
const TREE_LEAF_RATE = 0.5;
const TREE_LEAF_SIZE = 2;

const TREE_DIRECTIONS = (function() {
  var result = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const numMatches = +(x === y) + +(y === z) + +(x === z);
        if (numMatches === 1) {
          result.push({ x: x, y: y, z: z });
        }
      }
    }
  }
  return result;
})();

const min = Math.min;
const abs = Math.abs;
const floor = Math.floor;
const pow = Math.pow;
const sqrt = Math.sqrt;

function voxelTerrain(opts) {
  opts = opts || {};
  const chunkSize = opts.chunkSize || 32;
  const vu = voxelUtils({chunkSize});

  const rng = new Alea(opts.seed);
  const terrainNoise = new FastSimplexNoise({
    min: TERRAIN_FLOOR,
    max: TERRAIN_CEILING,
    frequency: TERRAIN_FREQUENCY,
    octaves: TERRAIN_OCTAVES,
    random: rng
  });

  const treeNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
    random: rng
  });
  const treeLeafNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
    random: rng
  });

  const crustBedrockNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
    random: rng
  });
  const crustCoreNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
    random: rng
  });
  const crustMantleNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
    random: rng
  });
  const crustCrustNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: DIRT_FREQUENCY,
    octaves: DIRT_OCTAVES,
    random: rng
  });

  const riverNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: RIVER_FREQUENCY,
    octaves: RIVER_OCTAVES,
    random: rng
  });

  const riverTypeNoise = new FastUniformNoise({
    min: 0,
    max: 1,
    frequency: RIVER_TYPE_FREQUENCY,
    octaves: RIVER_TYPE_OCTAVES,
    random: rng
  });

  const caveNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: CAVE_FREQUENCY,
    octaves: CAVE_OCTAVES,
    random: rng
  });

  const vegetationNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: VEGETATION_FREQUENCY,
    octaves: VEGETATION_OCTAVES,
    random: rng
  });
  const vegetationTypeNoise = new FastUniformNoise({
    min: 0,
    max: 1,
    frequency: VEGETATION_TYPE_FREQUENCY,
    octaves: VEGETATION_TYPE_OCTAVES,
    random: rng
  });

  const entityNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: ENTITY_FREQUENCY,
    octaves: ENTITY_OCTAVES,
    random: rng
  });
  const entityTypeNoise = new FastUniformNoise({
    min: 0,
    max: 1,
    frequency: ENTITY_TYPE_FREQUENCY,
    octaves: ENTITY_TYPE_OCTAVES,
    random: rng
  });

  const weatherNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: WEATHER_FREQUENCY,
    octaves: WEATHER_OCTAVES,
    random: rng
  });
  const weatherTypeNoise = new FastUniformNoise({
    min: 0,
    max: 1,
    frequency: WEATHER_TYPE_FREQUENCY,
    octaves: WEATHER_TYPE_OCTAVES,
    random: rng
  });

  const effectNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: EFFECT_FREQUENCY,
    octaves: EFFECT_OCTAVES,
    random: rng
  });
  const effectTypeNoise = new FastUniformNoise({
    min: 0,
    max: 1,
    frequency: EFFECT_TYPE_FREQUENCY,
    octaves: EFFECT_TYPE_OCTAVES,
    random: rng
  });

  return function generateChunk(position) {
    const startX = position[0] * chunkSize;
    const startY = position[1] * chunkSize;
    const startZ = position[2] * chunkSize;

    const endX = startX + chunkSize;
    const endY = startY + chunkSize;
    const endZ = startZ + chunkSize;

    const voxels = new Int16Array(chunkSize * chunkSize * chunkSize);
    const vegetations = {};
    const weathers = {};
    const effects = {};
    const entities = {};

    const riverSurfaces = [];

    forEachPointInside(genPoint);
    postProcessPoints();

    function forEachPointInside(fn) {      
      for (let x = startX; x < endX; x++) {
        for (let z = startZ; z < endZ; z++) {
          fn(x, z);
        }
      }
    }

    function genPoint(x, z) {
      let h = floor(terrainNoise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR));
      if (h === TERRAIN_FLOOR || (h >= startY && h < endY)) {
        genLand(x, h, z);
        genDirt(x, h, z);
        genRivers(x, h, z);
        if (!isRiverSurface(x, h, z) && !isCaveSurface(x, h, z)) {
          genTrees(x, h, z);
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
    }

    function postProcessPoints() {
      postRiv();
    }

    function genLand(x, y, z) {
      if (!isRiverSurface(x, y, z) && !isCaveSurface(x, y, z)) {
        setVoxel(x, y, z, BLOCKS['grass_top_plains']);
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
              return BLOCKS['bedrock'];
            } else if (y < coreThreshold) {
              return BLOCKS['lava_still'];
            } else if (y < mantleThreshold) {
              return BLOCKS['obsidian'];
            } else if (y < crustThreshold) {
              return BLOCKS['stone'];
            } else {
              return BLOCKS['dirt'];
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
            return BLOCKS['water_still'];
          } else if (riverNoiseN < (RIVER_RATE * (1 + SHORE_RATE))) {
            const riverTypeNoiseN = riverTypeNoise.in2D(x, z);
            const riverThresholdName = (() => {
              for (let i = 0; i < RIVER_SAND_THRESHOLDS.length; i++) {
                const riverThreshold = RIVER_SAND_THRESHOLDS[i];
                const {name, threshold} = riverThreshold;
                if (riverTypeNoiseN < threshold) {
                  return name;
                }
              }
              return null;
            })();
            if (riverThresholdName !== null) {
              return BLOCKS[riverThresholdName];
            } else {
              const lastRiverThreshold = RIVER_SAND_THRESHOLDS[RIVER_SAND_THRESHOLDS.length - 1];
              const lastRiverThresholdName = lastRiverThreshold.name;
              return BLOCKS[lastRiverThresholdName];
            }
          } else {
            return null;
          }
        })();
        if (material !== null) {
          setVoxel(x, y, z, material);

          if (y === h && material === BLOCKS['water_still'] && startY <= SEA_LEVEL && endY > SEA_LEVEL) {
            riverSurfaces.push([x, h, z]);
          }
        }
      }
    }

    function postRiv() {
      // XXX coalesce this into pools and smooth individually for each
      const riverSurfacesMedianHeight = riverSurfaces.map(riverSurface => riverSurface[1]).sort()[floor(riverSurfaces.length * RIVER_SURFACE_MEDIAN_FACTOR)];
      for (let i = 0; i < riverSurfaces.length; i++) {
        const riverSurface = riverSurfaces[i];
        const [x, h, z] = riverSurface;
        for (let y = h; y <= riverSurfacesMedianHeight; y++) {
          const river = BLOCKS['water_still'];
          setVoxel(x, y, z, river);
        }
      }
    }

    function genTrees(x, y, z) {
      var treeNoiseN = treeNoise.in2D(x, z);
      if (treeNoiseN >= (1 - TREE_RATE)) {
        var treeHeightNoiseN = sliceNoise(treeNoiseN, TREE_RATE, 1);

        var height = TREE_MIN_HEIGHT + (treeHeightNoiseN * (TREE_MAX_HEIGHT - TREE_MIN_HEIGHT));
        var base = height * TREE_BASE_RATIO;

        function position() {
          return { x: x, y: y, z: z };
        }

        function leafPoints(fn) {
          for (var j = -TREE_LEAF_SIZE; j <= TREE_LEAF_SIZE; j++) {
            for (var k = -TREE_LEAF_SIZE; k <= TREE_LEAF_SIZE; k++) {
              if (j === 0 && k === 0) continue;
              fn(j, k);
            }
          }
        }

        for (var i = 0; i < height; i++) {
          var pos = position();
          pos.y = y + i;
          setVoxelInside(pos.x, pos.y, pos.z, BLOCKS['log_big_oak']);

          if (i >= base) {
            var leafSets = {};
            leafPoints(function(j, k) {
              pos.x = x + j;
              pos.z = z + k;

              var treeLeafN = treeLeafNoise.in3D(pos.x, pos.y, pos.z);
              var treeLeafDistance = sqrt(j * j + k * k);
              var treeLeafProbability = TREE_LEAF_RATE - ((treeLeafDistance - 1) / (TREE_LEAF_SIZE - 1)) * TREE_LEAF_RATE;
              if (treeLeafN < treeLeafProbability) {
                var idx = vu.getIndex(pos.x, pos.y, pos.z);
                leafSets[idx] = true;
              }
            });
            leafPoints(function(j, k) {
              pos.x = x + j;
              pos.z = z + k;

              if (TREE_DIRECTIONS.some(function(d) {
                var idx = vu.getIndex(pos.x + d.x, pos.y + d.y, pos.z + d.z);
                return !!leafSets[idx];
              })) {
                setVoxelInside(pos.x, pos.y, pos.z, BLOCKS['leaves_big_oak_plains']);
              }
            });
          }
        }
        
        var pos = position();
        pos.y = y + i;
        var tipTreeLeafN = treeLeafNoise.in3D(pos.x, pos.y, pos.z);
        if (tipTreeLeafN < TREE_LEAF_RATE) {
          setVoxelInside(pos.x, pos.y, pos.z, BLOCKS['leaves_big_oak_plains']);
        }
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
        setWeather(x, y, z, weather);
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

    function setVegetation(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      const [,,,idx] = idxSpec;
      [x, y, z] = idxSpec;
      vegetations[idx] = [x, y, z, value];
    }

    function setWeather(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      const [,,,idx] = idxSpec;
      [x, y, z] = idxSpec;
      weathers[idx] = [x, y, z, value];
    }

    function setEffect(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      const [,,,idx] = idxSpec;
      [x, y, z] = idxSpec;
      effects[idx] = [x, y, z, value];
    }

    function setEntity(x, y, z, value) {
      const idxSpec = vu.getIndexSpec(x, y, z);
      const [,,,idx] = idxSpec;
      [x, y, z] = idxSpec;
      entities[idx] = [x, y, z, value];
    }

    function isInside(x, y, z) {
      return x >= startX && x < endX &&
        y >= startY && y < endY &&
        z >= startZ && z < endZ;
    }

    function setVoxelInside(x, y, z, value) {
      if (isInside(x, y, z)) {
        var idx = vu.getIndex(x, y, z);
        voxels[idx] = value;
      }
    }

    function sliceNoise(n, min, max) {
      return (n - min) / (max - min)
    }

    const dims = [chunkSize, chunkSize, chunkSize];

    return {
      position,
      dims,
      voxels,
      vegetations,
      entities,
      weathers,
      effects,
    };
  }
}

if (module) {
  module.exports = voxelTerrain;
}
