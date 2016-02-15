var voxelAsync = require('../voxel-async/index');
var voxelRenderer = require('../voxel-renderer/index');

function voxelPlaneRenderer(data, THREE) {
  const {vegetations, weathers, dims} = data;
  const planes = voxelAsync.planeMesher({vegetations, weathers}, dims);
  const mesh = voxelRenderer(planes, THREE);
  return mesh;
}

module.exports = voxelPlaneRenderer;
