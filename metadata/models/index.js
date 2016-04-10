const ModelBase = require('./ModelBase');

const ModelChest = require('./ModelChest');
const ModelChicken = require('./ModelChicken');
const ModelCow = require('./ModelCow');
const ModelCreeper = require('./ModelCreeper');
const ModelOcelot = require('./ModelOcelot');
const ModelPig = require('./ModelPig');
const ModelRabbit = require('./ModelRabbit');
const ModelSlime = require('./ModelSlime');
const ModelWolf = require('./ModelWolf');

const api = {};

api.MODELS = _makeModelMap([
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelRabbit,
  ModelSlime,
  ModelWolf,
]);

api.ENTITIES = _makeEntitySpecs([
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelRabbit,
  ModelSlime,
  ModelWolf,
]);

api.make = function(modelName, p, s, game) {
  p = p || [];
  s = s || [];
  
  const Model = api.MODELS[modelName];
  const model = new Model(p, s);
  return model;
};

module.exports = api;

function _makeModelMap(models) {
  const result = {};
  models.forEach(model => {
    const NAME = model.NAME;
    result[NAME] = model;
  });
  return result;
}

function _makeEntitySpecs(models) {
  return models.map(model => {
    const NAME = model.NAME;
    const spec = {
      model: NAME,
      p: [],
      s: []
    };
    return spec;
  });
}
