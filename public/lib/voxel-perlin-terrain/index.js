var min = Math.min;
var abs = Math.abs;
var floor = Math.floor;
var pow = Math.pow;
var sqrt = Math.sqrt;

var Alea = require('alea');
var noise = require('perlin').noise;
var FastSimplexNoise = require('fast-simplex-noise');

var OBSIDIAN = 1;
var GRASS = 2;
var LEAVES = 3;
var BARK = 4;

var TERRAIN_FLOOR = 0;
var TERRAIN_CEILING = 20; // minecraft's limit
var TERRAIN_FREQUENCY = 1;
var TERRAIN_OCTAVES = 8;
var TERRAIN_DIVISOR = 80;

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
  var terrainRng = new Alea(opts.seed + '-terrain');
  var terrainNoise = new FastSimplexNoise({
    min: TERRAIN_FLOOR,
    max: TERRAIN_CEILING,
    frequency: TERRAIN_FREQUENCY,
    octaves: TERRAIN_OCTAVES,
    random: terrainRng
  });
  var treeRng = new Alea(opts.seed + '-tree');
  var treeNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: 1,
    octaves: 2,
    random: treeRng
  });
  var treeLeafRng = new Alea(opts.seed + '-leaf');
  var treeLeafNoise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: 0.5,
    octaves: 1,
    random: treeLeafRng
  });

  return function generateChunk(position, width) {
    var startX = position[0] * width;
    var startY = position[1] * width;
    var startZ = position[2] * width;

    var endX = startX + width;
    var endY = startY + width;
    var endZ = startZ + width;

    var chunk = new Int8Array(width * width * width);
    pointsInside(point);

    function point(x, z) {
      var y = floor(terrainNoise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR));
      if (y === TERRAIN_FLOOR || (y >= startY && y < endY)) {
        land(x, y, z);
        tree(x, y, z);
        mines(x, y, z);
      } else {
        mines(x, width, z);
      }
    }

    function land(x, y, z) {
      set(x, y, z, GRASS);
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
          setMaybe(pos.x, pos.y, pos.z, BARK);

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
                setMaybe(pos.x, pos.y, pos.z, LEAVES);
              }
            });
          }
        }
        
        var pos = position();
        pos.y = y + i;
        var tipTreeLeafN = treeLeafNoise.in3D(pos.x, pos.y, pos.z);
        if (tipTreeLeafN < TREE_LEAF_RATE) {
          setMaybe(pos.x, pos.y, pos.z, LEAVES);
        }
      }
    }

    function mines(x, y, z) {
      for (var i = startY; i < y; i++) {
        set(x, i, z, OBSIDIAN);
      }
    }

    function pointsInside(fn) {
      for (var x = startX; x < endX; x++) {
        for (var z = startZ; z < endZ; z++) {
          fn(x, z);
        }
      }
    }

    function getIndex(x, y, z) {
      var xidx = abs((width + x % width) % width);
      var yidx = abs((width + y % width) % width);
      var zidx = abs((width + z % width) % width);
      var idx = xidx + yidx * width + zidx * width * width;
      return idx;
    }

    function get(x, y, z) {
      var idx = getIndex(x, y, z);
      return chunk[idx];
    }

    function set(x, y, z, value) {
      var idx = getIndex(x, y, z);
      chunk[idx] = value;
    }

    function isInside(x, y, z) {
      return x >= startX && x < endX &&
        y >= startY && y < endY &&
        z >= startZ && z < endZ;
    }

    function setMaybe(x, y, z, value) {
      if (isInside(x, y, z)) {
        var idx = getIndex(x, y, z);
        chunk[idx] = value;
      }
    }

    function sliceNoise(n, min, max) {
      return (n - min) / (max - min)
    }

    return chunk;
  }
}
