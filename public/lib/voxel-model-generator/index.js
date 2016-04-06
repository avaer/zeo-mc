var metadata = require('../../metadata/index');
var Models = metadata.MODELS;
var ENTITIES = Models.ENTITIES;

function voxelModelGenerator() {
  return function(entities, dims) {
    const models = [];

    for (let i in entities) {
      const entity = entities[i];
      if (entity !== null) {
        const [x, y, z, value] = entity;

        const modelSpec = ENTITIES[value - 1];
        if (!modelSpec) {
          throw new Error('invalid model value: ' + JSON.stringify(value));
        }
        const {model: modelName, p, s} = modelSpec;
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
