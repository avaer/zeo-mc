var min = Math.min;
var abs = Math.abs;
var floor = function(n) {
  return ~~n;
};

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

module.exports = function(opts) {
  opts = opts || {};
  var rng = new Alea(opts.seed);
  var noise = new FastSimplexNoise({
    min: TERRAIN_FLOOR,
    max: TERRAIN_CEILING,
    frequency: TERRAIN_FREQUENCY,
    octaves: TERRAIN_OCTAVES,
    random: rng
  });

  return function generateChunk(position, width) {
    var startX = position[0] * width;
    var startY = position[1] * width;
    var startZ = position[2] * width;

    var endX = startX + width;
    var endY = startY + width;
    var endZ = startZ + width;

    var chunk = new Int8Array(width * width * width);
    pointsInside(startX, startZ, width, function(x, z) {
      // var n = noise.simplex2(x / divisor, z / divisor);
      // var y = ~~scale(n, -1, 1, floor, ceiling);
      var y = floor(noise.in2D(x / TERRAIN_DIVISOR, z / TERRAIN_DIVISOR));
      /* if (y > startY + width) {
        console.log('got y', {y, limit: startY + width});
        y = startY + width - 1;
      } */
      if (y === TERRAIN_FLOOR || (y >= startY && y < endY)) {
        // floor
        var idx = getIndex(x, y, z, width);
        chunk[idx] = GRASS;

        // trees
        if (rng() < 0.01) {
          tree(x, y, z);
        }

        // mines
        for (var i = startY; i < y; i++) {
          var idx = getIndex(x, i, z, width);
          chunk[idx] = OBSIDIAN;
        }
      }
    });

    function tree(x, y, z) {
      var opts = {};
      if (!opts.height) opts.height = rng() * 16 + 4;
      if (opts.base === undefined) opts.base = opts.height / 3;

      var chunkSize = width;
      var cubeSize = 1;
      var step = chunkSize * cubeSize;
      
      function position () {
        return { x: x, y: y, z: z };
      }
      
      /* var ymax = 1 * step;
      var ymin = 0 * step;
      if (occupied(pos_.y)) {
          for (var y = pos_.y; occupied(y); y += cubeSize);
          if (y >= ymax) return false;
          pos_.y = y;
      }
      else {
          for (var y = pos_.y; !occupied(y); y -= cubeSize);
          if (y <= ymin) return false;
          pos_.y = y + cubeSize;
      }
      function occupied (y) {
          var pos = position();
          pos.y = y;
          return y <= ymax && y >= ymin && chunk[getIndex(pos.x, pos.y, pos.z, chunkSize)] === undefined;
      } */
      
      var around = [
          [ 0, 1 ], [ 0, -1 ],
          [ 1, 1 ], [ 1, 0 ], [ 1, -1 ],
          [ -1, 1 ], [ -1, 0 ], [ -1, -1 ]
      ];
      for (var y = 0; y < opts.height - 1; y++) {
          var pos = position();
          // pos.y += y * cubeSize;
          if (set(pos, BARK)) break;
          if (y < opts.base) continue;
          around.forEach(function (offset) {
              if (!(rng() < 0.6)) return;
              var x = offset[0] * cubeSize;
              var z = offset[1] * cubeSize;
              pos.x += x; pos.z += z;
              set(pos, LEAVES);
              pos.x -= x; pos.z -= z;
          });
      }
      
      var pos = position();
      pos.y = y;
      // pos.y += y * cubeSize;
      set(pos, LEAVES);

      function set(pos, value) {
        // console.log('tree set', {pos, value});
        var idx = getIndex(pos.x, pos.y, pos.z, chunkSize);
        chunk[idx] = value;
          /* var ex = voxels.voxelAtPosition([pos.x,pos.y,pos.z]);
          if (ex) true;
          voxels.voxelAtPosition([pos.x,pos.y,pos.z], value);
          var c = voxels.chunkAtPosition([pos.x,pos.y,pos.z]);
          var key = c.join('|');
          if (!updated[key] && voxels.chunks[key]) {
              updated[key] = voxels.chunks[key];
          } */
      }
      
      /* return Object.keys(updated).forEach(function (key) {
        return updated[key];
      }); */
    }

    return chunk
  }
}

function getIndex(x, y, z, width) {
  var xidx = abs((width + x % width) % width)
  var yidx = abs((width + y % width) % width)
  var zidx = abs((width + z % width) % width)
  var idx = xidx + yidx * width + zidx * width * width
  return idx;
}

function pointsInside(startX, startY, width, func) {
  for (var x = startX; x < startX + width; x++)
    for (var y = startY; y < startY + width; y++)
      func(x, y)
}
