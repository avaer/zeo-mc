"use strict";

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
const ModelSpider = require('./ModelSpider');

const api = {};

api.MODELS = [
  /* ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelRabbit,
  ModelSlime,
  ModelWolf, */
  ModelSpider,
];

api.MODEL_NAMES = api.MODELS.map(Model => Model.NAME);

api.MODEL_INDEX = (() => {
  const result = {};
  for (let i = 0; i < api.MODELS.length; i++) {
    const Model = api.MODELS[i];
    const NAME = Model.NAME;
    result[NAME] = Model;
  }
  return result;
})();

api.ENTITIES = api.MODEL_NAMES;

module.exports = api;
