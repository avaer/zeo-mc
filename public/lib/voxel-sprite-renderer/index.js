var voxelAsync = require('../voxel-async/index');
var voxelSpriteMesher = require('../voxel-sprite-mesher/index');

function voxelSpriteRenderer(data, textureAtlas, THREE) {
  const {items, dims} = data;
  const sprites = voxelAsync.spriteGenerator({items}, dims);
  const mesh = voxelSpriteMesher(sprites, textureAtlas, THREE);
  return mesh;
}

module.exports = voxelSpriteRenderer;
