var Alea = require('alea');
var FastSimplexNoise = require('fast-simplex-noise');

var resources = require('../../resources/index');
var BLOCKS = resources.BLOCKS.BLOCKS;
var VEGETATIONS = resources.PLANES.VEGETATIONS;
var WEATHERS = resources.PLANES.WEATHERS;
var ENTITIES = resources.MODELS.ENTITIES;

var TERRAIN_FLOOR = 0;
var TERRAIN_CEILING = 20; // minecraft's limit
var TERRAIN_FREQUENCY = 1;
var TERRAIN_OCTAVES = 8;
var TERRAIN_DIVISOR = 80;

var DIRT_BOTTOM_THRESHOLD = -255;
var DIRT_BEDROCK_THRESHOLD = -250;
var DIRT_CORE_THRESHOLD = -200;
var DIRT_MANTLE_THRESHOLD = -20;
var DIRT_CRUST_THRESHOLD = 40;
var DIRT_FREQUENCY = 0.02;
var DIRT_OCTAVES = 6;

var CAVE_FREQUENCY = 0.02;
var CAVE_OCTAVES = 12;
var CAVE_RATE = 0.3;

var VEGETATION_FREQUENCY = 0.5;
var VEGETATION_OCTAVES = 6;
var VEGETATION_TYPE_FREQUENCY = 1;
var VEGETATION_TYPE_OCTAVES = 2;
var VEGETATION_RATE = 1 / 5;

var ENTITY_FREQUENCY = 0.5;
var ENTITY_OCTAVES = 6;
var ENTITY_TYPE_FREQUENCY = 1;
var ENTITY_TYPE_OCTAVES = 2;
var ENTITY_RATE = 1 / 10;

// var WEATHER_FREQUENCY = 0.02;
var WEATHER_FREQUENCY = 0.001;
var WEATHER_OCTAVES = 2;
var WEATHER_TYPE_FREQUENCY = 10;
var WEATHER_TYPE_OCTAVES = 2;
var WEATHER_RATE = 0.3;

var TREE_RATE = 0.1;
var TREE_MIN_HEIGHT = 4;
var TREE_MAX_HEIGHT = 14;
var TREE_BASE_RATIO = 0.3;
var TREE_LEAF_RATE = 0.5;
var TREE_LEAF_SIZE = 2;

var DIRECTIONS = (function() {
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
  const vegetationTypeNoise = new FastSimplexNoise({
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
  const entityTypeNoise = new FastSimplexNoise({
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
  const weatherTypeNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: WEATHER_TYPE_FREQUENCY,
    octaves: WEATHER_TYPE_OCTAVES,
    random: rng
  });

  return function generateChunk(position) {
    var startX = position[0] * chunkSize;
    var startY = position[1] * chunkSize;
    var startZ = position[2] * chunkSize;

    var endX = startX + chunkSize;
    var endY = startY + chunkSize;
    var endZ = startZ + chunkSize;

    var voxels = new Int8Array(chunkSize * chunkSize * chunkSize);
    var vegetations = [];
    var weathers = [];
    var entities = [];
    pointsInside(point);

    function point(x, z) {
      var y = floor(terrainNoise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR));
      if (y === TERRAIN_FLOOR || (y >= startY && y < endY)) {
        land(x, y, z);
        tree(x, y, z);
        dirt(x, y, z);
        veg(x, y, z);
        ent(x, y, z);
        !isCave(x,y,z) && weath(x, y, z);
      } else if (startY < 0) {
        dirt(x, endY, z);
      }
    }

    function land(x, y, z) {
      if (!isCave(x, y, z)) {
        setVoxel(x, y, z, BLOCKS['grass_top_plains']);
      }
    }

    function tree(x, y, z) {
      if (!isCave(x, y, z)) {
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
            setMaybe(pos.x, pos.y, pos.z, BLOCKS['log_big_oak']);

            if (i >= base) {
              var leafSets = {};
              leafPoints(function(j, k) {
                pos.x = x + j;
                pos.z = z + k;

                var treeLeafN = treeLeafNoise.in3D(pos.x, pos.y, pos.z);
                var treeLeafDistance = sqrt(j * j + k * k);
                var treeLeafProbability = TREE_LEAF_RATE - ((treeLeafDistance - 1) / (TREE_LEAF_SIZE - 1)) * TREE_LEAF_RATE;
                if (treeLeafN < treeLeafProbability) {
                  var idx = getIndex(pos.x, pos.y, pos.z);
                  leafSets[idx] = true;
                }
              });
              leafPoints(function(j, k) {
                pos.x = x + j;
                pos.z = z + k;

                if (DIRECTIONS.some(function(d) {
                  var idx = getIndex(pos.x + d.x, pos.y + d.y, pos.z + d.z);
                  return !!leafSets[idx];
                })) {
                  setMaybe(pos.x, pos.y, pos.z, BLOCKS['leaves_big_oak_plains']);
                }
              });
            }
          }
          
          var pos = position();
          pos.y = y + i;
          var tipTreeLeafN = treeLeafNoise.in3D(pos.x, pos.y, pos.z);
          if (tipTreeLeafN < TREE_LEAF_RATE) {
            setMaybe(pos.x, pos.y, pos.z, BLOCKS['leaves_big_oak_plains']);
          }
        }
      }
    }

    function dirt(x, h, z) {
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

      for (var y = startY; y < h; y++) {
        if (y < coreThreshold || !isCave(x, y, z)) {
          var material = (function() {
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

    function isCave(x, y, z) {
      const caveNoiseN = caveNoise.in3D(x, y, z);
      return caveNoiseN < CAVE_RATE;
    }

    function veg(x, h, z) {
      const y = h + 1;
      const vegetationNoiseN = vegetationNoise.in2D(x, z);
      if (vegetationNoiseN < VEGETATION_RATE) {
        const vegetationTypeNoiseN = vegetationTypeNoise.in2D(x, z);
        const vegetation = floor(vegetationTypeNoiseN * VEGETATIONS.length) + 1;
        setVegetation(x, y, z, vegetation);
      }
    }

    function ent(x, h, z) {
      const y = h + 1;
      const entityNoiseN = entityNoise.in2D(x, z);
      if (entityNoiseN < ENTITY_RATE) {
        const entityTypeNoiseN = entityTypeNoise.in2D(x, z);
        const entity = floor(entityTypeNoiseN * ENTITIES.length) + 1;
        setEntity(x, y, z, entity);
      }
    }

    function weath(x, h, z) {
      const y = h + 1;
      const weatherNoiseN = weatherNoise.in2D(x, z);
      if (weatherNoiseN < WEATHER_RATE) {
        const weatherTypeNoiseN = weatherTypeNoise.in2D(x, z);
        const weather = floor(weatherTypeNoiseN * WEATHERS.length) + 1;
        setWeather(x, y, z, weather);
      }
    }

    function pointsInside(fn) {
      for (var x = startX; x < endX; x++) {
        for (var z = startZ; z < endZ; z++) {
          fn(x, z);
        }
      }
    }

    function snapCoordinate(n) {
      return abs((chunkSize + n % chunkSize) % chunkSize);
    }

    function getIndex(x, y, z) {
      x = snapCoordinate(x);
      y = snapCoordinate(y);
      z = snapCoordinate(z);
      const idx = (x) + (y * chunkSize) + (z * chunkSize * chunkSize);
      return idx;
    }

    function setVoxel(x, y, z, value) {
      const idx = getIndex(x, y, z);
      voxels[idx] = value;
    }

    function setVegetation(x, y, z, value) {
      x = snapCoordinate(x);
      y = snapCoordinate(y);
      z = snapCoordinate(z);
      vegetations.push([x, y, z, value]);
    }

    function setWeather(x, y, z, value) {
      x = snapCoordinate(x);
      y = snapCoordinate(y);
      z = snapCoordinate(z);
      weathers.push([x, y, z, value]);
    }

    function setEntity(x, y, z, value) {
      x = snapCoordinate(x);
      y = snapCoordinate(y);
      z = snapCoordinate(z);
      entities.push([x, y, z, value]);
    }

    function isInside(x, y, z) {
      return x >= startX && x < endX &&
        y >= startY && y < endY &&
        z >= startZ && z < endZ;
    }

    function setMaybe(x, y, z, value) {
      if (isInside(x, y, z)) {
        var idx = getIndex(x, y, z);
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
      weathers
    };
  }
}

if (module) {
  module.exports = voxelTerrain;
}
