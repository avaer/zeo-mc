var voxelAsync = require('../voxel-async/index');
var voxelPlaneMesher = require('../voxel-plane-mesher/index');

function voxelPlaneRenderer(data, atlas, THREE) {
  const {vegetations, effects, dims} = data;
  const planes = voxelAsync.planeGenerator({vegetations, effects}, dims);
  const mesh = voxelPlaneMesher(planes, atlas, THREE);
  return mesh;
}

module.exports = voxelPlaneRenderer;
