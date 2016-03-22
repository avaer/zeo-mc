import THREE from 'three';
import * as Planes from '../../resources/planes/index';

const {WEATHERS} = Planes;

function voxelParticleGenerator() {
  return function({weathers}, dims) {
    const vertices = [];

    for (let i in weathers) {
      const weather = weathers[i];
      if (weather !== null) {
        const [x, y, z/*, value*/] = weather;
        vertices.push([x, y + 1, z]);
      }
    }

    return {vertices};
  };
}

if (module) {
  module.exports = voxelParticleGenerator;
}
