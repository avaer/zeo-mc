"use strict";

const metadata = require('../../../metadata/index');
const Models = metadata.MODELS;
const MODEL_NAMES = Models.MODEL_NAMES;
const MODEL_INDEX = Models.MODEL_INDEX;

function voxelModelGenerator() {
  return function(entities, dims) {
    const models = [];

    for (let i in entities) {
      const entity = entities[i];
      if (entity !== null) {
        const [x, y, z, value] = entity;

        const modelName = MODEL_NAMES[value - 1];
        if (!modelName) {
          throw new Error('invalid model value: ' + JSON.stringify(value));
        }
        const Model = MODEL_INDEX[modelName];
        const modelInstance = new Model();

        const position = [x, y, z];
        const {meshes} = modelInstance;
        const {TEXTURE: texture} = Model;
        const model = {position, meshes, texture};

        models.push(model);
      }
    }

    return models;
  };
}

if (module) {
  module.exports = voxelModelGenerator;
}
