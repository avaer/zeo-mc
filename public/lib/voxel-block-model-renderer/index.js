var voxelAsync = require('../voxel-async/index');
var voxeBlockModelMesher = require('../voxel-block-model-mesher/index');

function voxelBlockModelRenderer(data, textureAtlas, THREE) {
  const {voxels, metadata, dims} = data;
  const blockModels = voxelAsync.blockModelGenerator({voxels, metadata}, dims);
  const mesh = voxeBlockModelMesher(blockModels, textureAtlas, THREE);
  return mesh;
}

module.exports = voxelBlockModelRenderer;
