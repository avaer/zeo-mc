const voxelAsync = require('../voxel-async/index');
const voxelRenderer = require('../voxel-renderer/index');

function voxelBlockRenderer(data, atlas, THREE) {
  const {voxels, dims} = data;
  const blocks = voxelAsync.blockMesher(voxels, dims);
  const mesh = voxelRenderer(blocks, atlas, THREE);
  return mesh;
}

module.exports = voxelBlockRenderer;
