const voxelAsync = require('../voxel-async/index');
const voxelBlockGenerator = require('../voxel-block-generator/index');
const voxelBlockMesher = require('../voxel-block-mesher/index');

function VoxelConstruct(game, opts) {
  opts = opts || {};
  if (!opts.limit) opts.limit = function () { return false };
  if (opts.yield === undefined) opts.yield = 4;
  if (!opts.expire) opts.expire = {};
  if (typeof opts.expire === 'number') {
    opts.expire = { start : opts.expire, end : opts.expire };
  }
  if (!opts.expire.start) opts.expire.start = 15 * 1000;
  if (!opts.expire.end) opts.expire.end = 30 * 1000;
  if (!opts.power) opts.power = 1;

  this._game = game;
  this._limit = opts.limit;
  this._yield = opts.yield;
  this._power = opts.power;
  this._expire = opts.expire;

  this._game.on('collision', item => {
    if (!item._debris) return;
    if (this._limit && this._limit(item)) return;

    this._game.removeItem(item);
  });
}
VoxelConstruct.prototype.set = function(pos, value) {
  this._game.setValue(pos, value);
};
VoxelConstruct.prototype.delete = function(pos) {
  const value = this._game.getValue(pos);

  if (value) {
    this._game.deleteValue(value);
    
    const {type} = value;
    if (type === 'block') {
      const {variant: {block}} = value;
      for (let i = 0; i < this._yield; i++) {
        let item = this.createDebris(pos, block, this._power);
        item = this._game.addItem(item);

        const time = this._expire.start + Math.random() * (this._expire.end - this._expire.start);

        (item => {
          this._game.setTimeout(() => {
            this._game.removeItem(item);
          }, time);
        })(item);
      }

      const onTopPos = [pos[0], pos[1] + 1, pos[2]];
      const onTopValue = this._game.getValue(onTopPos);
      if (onTopValue) {
        const {type: onTopType} = onTopValue;
        if (onTopType === 'vegetation' || onTopType === 'effect') {
          this._game.deleteValue(onTopValue);
        }
      }
    }

    return value;
  } else {
    return null;
  }
};
VoxelConstruct.prototype.createDebris = function(pos, value, power) {
  const geometry = (() => {
    const cubeGeometry = new this._game.THREE.CubeGeometry(1, 1, 1);
    const bufferGeometry = new this._game.THREE.BufferGeometry().fromGeometry(cubeGeometry);
    const normals = bufferGeometry.getAttribute('normal').array;

    const facesData = [value, value, value, value, value, value];
    const frameUvs = voxelBlockGenerator.getFrameUvs(facesData, normals, voxelAsync);
    voxelBlockMesher.applyFrameUvs(bufferGeometry, frameUvs, this._game.THREE);

    return bufferGeometry;
  })();
  const {material} = this._game.blockShader;
  const mesh = (() => {
    const mesh = new this._game.THREE.Mesh(geometry, material);
    mesh.scale.set(0.25, 0.25, 0.25);
    mesh.translateX(pos[0]);
    mesh.translateY(pos[1]);
    mesh.translateZ(pos[2]);
    return mesh;
  })();
  
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

function voxelConstruct(game, opts) {
  return new VoxelConstruct(game, opts);
}

module.exports = voxelConstruct;
