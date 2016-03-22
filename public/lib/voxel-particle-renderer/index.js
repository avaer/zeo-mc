var voxelAsync = require('../voxel-async/index');
var voxelParticleMesher = require('../voxel-particle-mesher/index');

function voxelParticleRenderer(data, THREE) {
  const {weathers, dims} = data;
  const particles = voxelAsync.particleGenerator({weathers}, dims);
  const mesh = voxelParticleMesher(particles, THREE);
  return mesh;
}

module.exports = voxelParticleRenderer;
