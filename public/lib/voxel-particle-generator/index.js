import THREE from 'three';
import * as Planes from '../../resources/planes/index';

const {WEATHERS} = Planes;

function voxelParticleGenerator() {
  return function({weathers}, dims) {
    const vertices = [];
    const offsets = [];

    for (let i = 0; i < weathers.length; i++) {
      const weather = weathers[i];
      const [x, y, z, offset/*, value*/] = weather;
      vertices.push([x, y, z]);
      offsets.push(offset);
    }

    return {vertices, offsets};
  };
}

if (module) {
  module.exports = voxelParticleGenerator;
}
