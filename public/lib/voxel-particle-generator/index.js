import THREE from 'three';
import * as Planes from '../../resources/planes/index';

const {WEATHERS} = Planes;

function voxelParticleGenerator() {
  return function({weathers}, dims) {
    const vertices = [];

    for (let k in weathers) {
      const weather = weathers[k];
      if (weather !== null) {
        const [x, y, z/*, value*/] = weather;
        vertices.push([x + 0.5, y + 1, z + 0.5]);
      }
    }

    return {vertices};
  };
}

if (module) {
  module.exports = voxelParticleGenerator;
}
