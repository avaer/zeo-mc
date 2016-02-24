var voxelAsync = require('../voxel-async/index');
var voxelRenderer = require('../voxel-renderer/index');

function voxelPlaneRenderer(data, THREE) {
  const {vegetations, weathers, effects, dims} = data;
  const planes = voxelAsync.planeMesher({vegetations, weathers, effects}, dims);
  const mesh = voxelRenderer(planes, THREE);
  return mesh;
}

module.exports = voxelPlaneRenderer;
