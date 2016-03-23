const resources = require('../../resources/index');
const BLOCKS = resources.BLOCKS;
const voxelBlockRenderer = require('../voxel-block-renderer/index');
const voxelAsync = require('../voxel-async/index');
const voxel = require('../voxel/index');

const indev = require('indev');

const constants = require('../../constants/index');
const DEFAULT_SEED = constants.DEFAULT_SEED;
const CLOUD_VALUE = BLOCKS.BLOCKS['water_still_0'];

const {random} = Math;

function Clouds(opts) {
  if (!(this instanceof Clouds)) return new Clouds(opts || {});
  if (opts.THREE) opts = {game:opts};
  this.game = opts.game;
  this.atlas = opts.atlas;
  this.high = opts.high || 10;
  this.distance = opts.distance || 300;
  this.size = opts.size || 16;
  this.many = opts.many || 100;
  this.speed = opts.speed || 0.01;
  this.material = opts.material || new this.game.THREE.MeshBasicMaterial({
    shading: this.game.THREE.FlatShading,
    fog: false,
    transparent: true,
    opacity: 0.5,
  });
  this.clouds = [];
  this.generator = (() => {
    const noise = indev({
      seed: DEFAULT_SEED
    }).simplex({
      min: 0,
      max: 1,
      frequency: 0.05,
      octaves: 10,
    });
    const offset = Number.MAX_SAFE_INTEGER / 2;

    return (x, y, i) => {
      const noiseN = noise.in2D(x + (i * this.size) + offset, y + (i * this.size) + offset);
      if (noiseN > 0.5) {
        return CLOUD_VALUE;
      } else {
        return 0;
      }
    };
  })();
  for (var i = 0; i < this.many; i++) {
    this.generate(i);
  }
}
module.exports = Clouds;

Clouds.prototype.generate = function(i) {
  var game = this.game;
  var atlas = this.atlas;
  var size = this.size;

  var data = voxel.generate([0, 0, 0], [size, 1, size], (x, y, z) => {
    return this.generator(x, z, i);
  });

  var cloud = voxelBlockRenderer(data, atlas, game.THREE);
  cloud.material = this.material;

  game.scene.add(cloud);

  this._position(cloud);

  this.clouds.push(cloud);
  return cloud;
};

Clouds.prototype.tick = function(dt) {
  var self = this;
  var player = self.game.controls.target().avatar.position;
  self.clouds.forEach(function(cloud) {
    cloud.position.z += self.speed * rand(1, 1.5);
    if (distanceTo(cloud.position, player) > self.distance) {
      self._position(cloud);
    }
  });
};

Clouds.prototype._position = function(cloud) {
  var player = this.game.controls.target().avatar.position;
  var x = rand(player.x - this.distance, player.x + this.distance);
  var y = player.y + this.high + rand(0, this.high * 2);
  var z = rand(player.z - this.distance, player.z + this.distance);
  cloud.position.set(x, y, z);
};

function rand(min, max) {
  return Math.floor(random() * (max - min + 1) + min);
}

function distanceTo(a, b) {
  if (!Array.isArray(a)) a = [a.x, a.y, a.z];
  if (!Array.isArray(b)) b = [b.x, b.y, b.z];
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  var dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
