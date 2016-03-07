import THREE from 'three';
// import * as Blocks from '../../resources/blocks/index';
// import * as Planes from '../../resources/planes/index';

// const {BLOCKS} = Blocks;
// const {VEGETATIONS, WEATHERS, EFFECTS} = Planes;

const SIZE = 0.25;

function voxelSpriteGenerator() {
  return function({items}, dims) {
    const vertices = [];
    const faces = [];

    const numItems = items.length;
    for (let i = 0; i < numItems; i++) {
      const item = items[i];

      // XXX

      vertices.push([0, 0, 0]);
      vertices.push([1, 1, 1]);
      vertices.push([2, 2, 2]);
      vertices.push([3, 3, 3]);
      faces.push(item);
    }

    return {vertices, faces};
  };
}

if (module) {
  module.exports = voxelSpriteGenerator;
}
