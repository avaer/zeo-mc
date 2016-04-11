var voxelAsync = require('../voxel-async/index');
var voxelPlaneMesher = require('../voxel-plane-mesher/index');

function voxelPlaneRenderer(data, textureAtlas, THREE) {
  const {vegetations, effects, dims} = data;
  const planes = voxelAsync.planeGenerator({vegetations, effects}, dims);
  const mesh = voxelPlaneMesher(planes, textureAtlas, THREE);
  return mesh;
}

module.exports = voxelPlaneRenderer;
