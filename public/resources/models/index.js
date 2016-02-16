import ModelBase from './ModelBase';

import ModelChest from './ModelChest';
import ModelChicken from './ModelChicken';
import ModelCow from './ModelCow';
import ModelCreeper from './ModelCreeper';
import ModelOcelot from './ModelOcelot';
import ModelPig from './ModelPig';
import ModelSlime from './ModelSlime';
import ModelWolf from './ModelWolf';

// models

export const MODELS = _makeModelMap([
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelSlime,
  ModelWolf,
]);

// entities

export const ENTITIES = _makeEntitySpecs([
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelSlime,
  ModelWolf,
]);

// api

export function make(modelName, p = [], s = [], game) {
  const Model = MODELS[modelName];
  const model = new Model(p, s);
  return model;
}

// helpers

function _makeModelMap(models) {
  const result = {};
  models.forEach(model => {
    const {NAME} = model;
    result[NAME] = model;
  });
  return result;
}

function _makeEntitySpecs(models) {
  return models.map(model => {
    const {NAME} = model;
    const spec = {
      model: NAME,
      p: [],
      s: []
    };
    return spec;
  });
}
