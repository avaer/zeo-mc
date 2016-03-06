var Models = require('../../resources/models/index');
var ENTITIES = Models.ENTITIES;

function voxelModelGenerator() {
  return function(entities, dims) {
    const models = [];

    for (let i in entities) {
      const entity = entities[i];
      if (entity !== null) {
        const [x, y, z, value] = entity;

        const spec = ENTITIES[value - 1];
        const {model: modelName, p, s} = spec;
        const modelPrototype = Models.make(modelName, p, s);

        const position = [x, y, z];
        const {meshes, textures} = modelPrototype;
        const model = {position, meshes, textures};

        models.push(model);
      }
    }

    return models;
  };
}

if (module) {
  module.exports = voxelModelGenerator;
}
