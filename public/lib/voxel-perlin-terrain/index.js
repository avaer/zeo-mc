var noise = require('perlin').noise

var OBSIDIAN = 1;
var GRASS = 2;
var LEAVES = 3;
var BARK = 4;

module.exports = function(seed, floor, ceiling, divisor) {
  floor = floor || 0
  ceiling = ceiling || 20 // minecraft's limit
  divisor = divisor || 50
  noise.seed(seed)
  return function generateChunk(position, width) {
    var startX = position[0] * width
    var startY = position[1] * width
    var startZ = position[2] * width
    var chunk = new Int8Array(width * width * width)
    pointsInside(startX, startZ, width, function(x, z) {
      var n = noise.simplex2(x / divisor , z / divisor)
      var y = ~~scale(n, -1, 1, floor, ceiling)
      if (y === floor || startY < y && y < startY + width) {
        // floor
        var idx = getIndex(x, y, z, width);
        chunk[idx] = GRASS

        if (Math.random() < 0.01) {
          tree(x, y, z);
        }

        // mines
        for (var i = 0; i < y; i++) {
          var idx = getIndex(x, i, z, width);
          chunk[idx] = OBSIDIAN
        }
      }
    });

    // trees
    function tree(x, y, z) {
      var opts = {};
      if (!opts.height) opts.height = Math.random() * 16 + 4;
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
              if (!(Math.random() < 0.6)) return;
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

var abs = Math.abs;
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

function scale( x, fromLow, fromHigh, toLow, toHigh ) {
  return ( x - fromLow ) * ( toHigh - toLow ) / ( fromHigh - fromLow ) + toLow
}

function randomChunk (bounds) {
    var x = Math.random() * (bounds.x.max - bounds.x.min) + bounds.x.min;
    var y = Math.random() * (bounds.y.max - bounds.y.min) + bounds.y.min;
    var z = Math.random() * (bounds.z.max - bounds.z.min) + bounds.z.min;
    return [ x, y, z ].map(Math.floor).join('|');
}

function boundingChunks (chunks) {
    return Object.keys(chunks).reduce(function (acc, key) {
        var s = key.split('|');
        if (acc.x.min === undefined) acc.x.min = s[0]
        if (acc.x.max === undefined) acc.x.max = s[0]
        if (acc.y.min === undefined) acc.y.min = s[1]
        if (acc.y.max === undefined) acc.y.max = s[1]
        if (acc.z.min === undefined) acc.z.min = s[2]
        if (acc.z.max === undefined) acc.z.max = s[2]
        
        acc.x.min = Math.min(acc.x.min, s[0]);
        acc.x.max = Math.max(acc.x.max, s[0]);
        acc.y.min = Math.min(acc.y.min, s[1]);
        acc.y.max = Math.max(acc.y.max, s[1]);
        acc.z.min = Math.min(acc.z.min, s[2]);
        acc.z.max = Math.max(acc.z.max, s[2]);
        
        return acc;
    }, { x: {}, y: {}, z: {} });
}
