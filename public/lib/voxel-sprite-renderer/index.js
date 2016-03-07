var voxelAsync = require('../voxel-async/index');
var voxelSpriteMesher = require('../voxel-sprite-mesher/index');

function voxelPlaneRenderer(data, atlas, THREE) {
  const {sprites, dims} = data;
  const sprites = voxelAsync.spriteGenerator({sprites}, dims);
  const mesh = voxelSpriteMesher(sprites, atlas, THREE);
  return mesh;
}

module.exports = voxelSpiteRenderer;
