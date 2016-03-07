var voxelAsync = require('../voxel-async/index');
var voxelSpriteMesher = require('../voxel-sprite-mesher/index');

function voxelSpriteRenderer(data, textureLoader, THREE) {
  const {items, dims} = data;
  const sprites = voxelAsync.spriteGenerator({items}, dims);
  const mesh = voxelSpriteMesher(sprites, textureLoader, THREE);
  return mesh;
}

module.exports = voxelSpriteRenderer;
