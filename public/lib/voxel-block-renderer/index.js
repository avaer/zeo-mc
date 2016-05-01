const voxelAsync = require('../voxel-async/index');
const voxelBlockMesher = require('../voxel-block-mesher/index');

function voxelBlockRenderer(data, textureAtlas, THREE) {
  const {voxels, metadata, dims} = data;
  const blocks = voxelAsync.blockGenerator({voxels, metadata}, dims);
  const mesh = voxelBlockMesher(blocks, textureAtlas, THREE);
  return mesh;
}

module.exports = voxelBlockRenderer;
