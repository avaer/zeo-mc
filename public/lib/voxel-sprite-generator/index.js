import THREE from 'three';
// import * as Blocks from '../../resources/blocks/index';
// import * as Planes from '../../resources/planes/index';

// const {BLOCKS} = Blocks;
// const {VEGETATIONS, WEATHERS, EFFECTS} = Planes;

const SIZE = 0.25;

function voxelSpriteGenerator() {
  return function({sprites}, dims) {
    const vertices = [];
    const faces = [];

    const numSprites = sprites.length;
    for (let i = 0; i < numSprites; i++) {
      const sprite = sprites[i];
      // XXX
    }

    return {vertices, faces};
  };
}

if (module) {
  module.exports = voxelSpriteGenerator;
}
