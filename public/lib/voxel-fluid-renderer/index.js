const voxelAsync = require('../voxel-async/index');
const voxelRenderer = require('../voxel-renderer/index');

function voxelBlockRenderer(data, THREE) {
  const {voxels, dims} = data;
  const blocks = voxelAsync.fluidMesher(voxels, dims);
  const mesh = voxelRenderer(blocks, THREE);
  return mesh;
}

module.exports = voxelBlockRenderer;