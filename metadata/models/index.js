"use strict";

const ModelBase = require('./ModelBase');

const ModelBat = require('./ModelBat');
const ModelChest = require('./ModelChest');
const ModelChicken = require('./ModelChicken');
const ModelCow = require('./ModelCow');
const ModelCreeper = require('./ModelCreeper');
const ModelHorse = require('./ModelHorse');
const ModelOcelot = require('./ModelOcelot');
const ModelPig = require('./ModelPig');
const ModelRabbit = require('./ModelRabbit');
const ModelSheep = require('./ModelSheep');
const ModelSkeleton = require('./ModelSkeleton');
const ModelSlime = require('./ModelSlime');
const ModelSpider = require('./ModelSpider');
const ModelSquid = require('./ModelSquid');
const ModelWolf = require('./ModelWolf');
const ModelZombie = require('./ModelZombie');

const api = {};

api.MODELS = [
  ModelBat,
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelHorse,
  ModelOcelot,
  ModelPig,
  ModelRabbit,
  ModelSheep,
  ModelSkeleton,
  ModelSlime,
  ModelSpider,
  ModelSquid,
  ModelWolf,
  ModelZombie,
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
