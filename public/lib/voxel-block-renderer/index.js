const voxelAsync = require('../voxel-async/index');
const voxelBlockMesher = require('../voxel-block-mesher/index');

function voxelBlockRenderer(data, atlas, THREE) {
  const {voxels, dims} = data;
  const blocks = voxelAsync.blockGenerator(voxels, dims);
  const mesh = voxelBlockMesher(blocks, atlas, THREE);
  return mesh;
}

module.exports = voxelBlockRenderer;
