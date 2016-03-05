var voxelAsync = require('../voxel-async/index');
var voxelRenderer = require('../voxel-renderer/index');

function voxelPlaneRenderer(data, atlas, THREE) {
  const {vegetations, weathers, effects, dims} = data;
  const planes = voxelAsync.planeGenerator({vegetations, weathers, effects}, dims);
  const mesh = voxelRenderer(planes, atlas, THREE);
  return mesh;
}

module.exports = voxelPlaneRenderer;
