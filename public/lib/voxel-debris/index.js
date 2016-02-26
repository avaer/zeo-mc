var funstance = require('funstance');
var EventEmitter = require('events').EventEmitter;

var voxelBlockShader = require('../voxel-block-shader/index');

module.exports = function (game, opts) {
    if (!opts) opts = {};
    if (!opts.limit) opts.limit = function () { return false };
    if (opts.yield === undefined) opts.yield = 4;
    
    if (!opts.expire) opts.expire = {};
    if (typeof opts.expire === 'number') {
        opts.expire = { start : opts.expire, end : opts.expire };
    }
    if (!opts.expire.start) opts.expire.start = 15 * 1000;
    if (!opts.expire.end) opts.expire.end = 30 * 1000;
    if (!opts.power) opts.power = 1;
    
    game.on('collision', function (item) {
      if (!item._debris) return;
      if (opts.limit && opts.limit(item)) return;

      game.removeItem(item);
      item._collected = true;
      em.emit('collect', item);
    });
    
    var em = new EventEmitter;
    return funstance(em, function (pos) {
      var value = game.getValue(pos);
      if (!value) return;
      game.deleteValue(value);
      
      const {type} = value;
      if (type === 'block') {
        const {value: blockValue} = value;
        for (let i = 0; i < opts.yield; i++) {
          var item = createDebris(game, pos, blockValue, opts.power);
          item = game.addItem(item);
          
          var time = opts.expire.start + Math.random() * (opts.expire.end - opts.expire.start);

          (function(item) {
            game.setTimeout(function() {
              game.removeItem(item);
              if (!item._collected) em.emit('expire', item);
            }, time);
          })(item);
        }
      }
    });
}

function _getDebrisGeometry(game, value) {
  const cubeGeometry = new game.THREE.CubeGeometry(1, 1, 1);
  const bufferGeometry = new game.THREE.BufferGeometry().fromGeometry(cubeGeometry);

  const colors = bufferGeometry.getAttribute('color');
  const colorArray = voxelBlockShader.colorValueToArray(value);
  for (let i = 0; i < colors.array.length; i += 3) {
    colors.array[i + 0] = colorArray[0];
    colors.array[i + 1] = colorArray[1];
    colors.array[i + 2] = colorArray[2];
  }

  return bufferGeometry;
}

function createDebris(game, pos, value, power) {
  const mesh = new game.THREE.Mesh(
    _getDebrisGeometry(game, value),
    game.blockShader.material
  );
  game.blockShader.paint(mesh);
  mesh.scale.set(0.25, 0.25, 0.25);
  mesh.translateX(pos[0]);
  mesh.translateY(pos[1]);
  mesh.translateZ(pos[2]);
  
  return {
    mesh: mesh,
    size: 1,
    collisionRadius: 22,
    value: value,
    velocity: {
      x: Math.random() * 0.02 * power,
      y: 0,
      z: Math.random() * 0.02 * power
    },
    _debris: true
  };
}
