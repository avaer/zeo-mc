var min = Math.min;
var abs = Math.abs;
var floor = Math.floor;
var pow = Math.pow;
var sqrt = Math.sqrt;

var Alea = require('alea');
var noise = require('perlin').noise;
var FastSimplexNoise = require('fast-simplex-noise');

var resources = require('../../resources/index');
var BLOCKS = resources.BLOCKS.BLOCKS;

var TERRAIN_FLOOR = 0;
var TERRAIN_CEILING = 20; // minecraft's limit
var TERRAIN_FREQUENCY = 1;
var TERRAIN_OCTAVES = 8;
var TERRAIN_DIVISOR = 80;

var DIRT_BEDROCK_THRESHOLD = -128;
var DIRT_CORE_THRESHOLD = -100;
var DIRT_MANTLE_THRESHOLD = -80;
var DIRT_CRUST_THRESHOLD = -10;

var TREE_RATE = 0.1;
var TREE_MIN_HEIGHT = 4;
var TREE_MAX_HEIGHT = 14;
var TREE_BASE_RATIO = 0.3;
var TREE_LEAF_RATE = 0.5;
var TREE_LEAF_SIZE = 2;

var DIRECTIONS = (function() {
  var result = [];
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      for (var z = -1; z <= 1; z++) {
        var numMatches = +(x === y) + +(y === z) + +(x === z);
        if (numMatches === 1) {
          result.push({ x: x, y: y, z: z });
        }
      }
    }
  }
  return result;
})();

module.exports = function(opts) {
  opts = opts || {};
  var chunkSize = opts.chunkSize || 32;
  var rng = new Alea(opts.seed);
  var terrainNoise = new FastSimplexNoise({
    min: TERRAIN_FLOOR,
    max: TERRAIN_CEILING,
    frequency: TERRAIN_FREQUENCY,
    octaves: TERRAIN_OCTAVES,
    random: rng
  });
  var treeNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
    random: rng
  });
  var treeLeafNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
    random: rng
  });
  var crustNoise = new FastSimplexNoise({
    min: DIRT_BEDROCK_THRESHOLD,
    max: 0,
    frequency: 0.5,
    octaves: 6,
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
    pointsInside(point);

    function point(x, z) {
      var y = floor(terrainNoise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR));
      if (y === TERRAIN_FLOOR || (y >= startY && y < endY)) {
        land(x, y, z);
        tree(x, y, z);
        dirt(x, y, z);
      } else if (startY < 0) {
        dirt(x, endY, z);
      }
    }

    function land(x, y, z) {
      set(x, y, z, BLOCKS['grass_top_plains']);
    }

    function tree(x, y, z) {
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

    function dirt(x, h, z) {
      crust(x, h, z);
      caves(x, h, z);
    }

    function crust(x, h, z) {
      var crustNoiseN = terrainNoise.in2D(x, z);
      for (var y = startY; y < h; y++) {
        var material = (function() {
          if (y <= DIRT_BEDROCK_THRESHOLD || crustNoiseN < DIRT_BEDROCK_THRESHOLD) {
            return BLOCKS['bedrock'];
          } else if (crustNoiseN < DIRT_CORE_THRESHOLD) {
            return BLOCKS['lava_still'];
          } else if (crustNoiseN < DIRT_MANTLE_THRESHOLD) {
            return BLOCKS['obsidian'];
          } else if (crustNoiseN < DIRT_CRUST_THRESHOLD) {
            return BLOCKS['stone'];
          } else {
            return BLOCKS['dirt'];
          }
        })();

        set(x, y, z, material);
      }
    }

    function caves(x, h, z) {
      // XXX
    }

    function pointsInside(fn) {
      for (var x = startX; x < endX; x++) {
        for (var z = startZ; z < endZ; z++) {
          fn(x, z);
        }
      }
    }

    function getIndex(x, y, z) {
      var xidx = abs((chunkSize + x % chunkSize) % chunkSize);
      var yidx = abs((chunkSize + y % chunkSize) % chunkSize);
      var zidx = abs((chunkSize + z % chunkSize) % chunkSize);
      var idx = xidx + yidx * chunkSize + zidx * chunkSize * chunkSize;
      return idx;
    }

    function get(x, y, z) {
      var idx = getIndex(x, y, z);
      return voxels[idx];
    }

    function set(x, y, z, value) {
      var idx = getIndex(x, y, z);
      voxels[idx] = value;
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

    return {
      position: position,
      dims: [chunkSize, chunkSize, chunkSize],
      voxels: voxels,
    };
  }
}
