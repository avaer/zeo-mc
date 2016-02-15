var models = require('../../resources/models/index');
var MODELS = models.MODELS;

function voxelModelMesher() {
  return function(entities, dims) {
    const vertices = [];
    const faces = [];

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const [x, y, z, value] = entity;

      const spec = MODELS[value - 1];
      const {model: modelName, p, s} = spec;

      const model = models.make(modelName, p, s);
      for (let j = 0; j < model.meshes.length; j++) {
        // XXX generate the mesh here
      }
    }

    return {vertices, faces};
  };
}

if (module) {
  module.exports = voxelModelMesher;
}
