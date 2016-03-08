import THREE from 'three';

function voxelSpriteGenerator() {
  return function({items}, dims) {
    const vertices = [];
    const faces = [];

    const numItems = items.length;
    for (let i = 0; i < numItems; i++) {
      const item = items[i];
      vertices.push([0, 0, 0]);
      vertices.push([1, 1, 1]);
      faces.push(item);
    }

    return {vertices, faces};
  };
}

if (module) {
  module.exports = voxelSpriteGenerator;
}
