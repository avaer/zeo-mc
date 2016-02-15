import ModelBase from './ModelBase';

import ModelCrop from './ModelCrop';
import ModelCross from './ModelCross';
import ModelTallgrass from './ModelTallgrass';
import ModelTallgrassDouble from './ModelTallgrassDouble';
import ModelTallgrassDoubleSunflower from './ModelTallgrassDoubleSunflower';

import ModelChest from './ModelChest';
import ModelChicken from './ModelChicken';
import ModelCow from './ModelCow';
import ModelCreeper from './ModelCreeper';
import ModelOcelot from './ModelOcelot';
import ModelPig from './ModelPig';
import ModelSlime from './ModelSlime';
import ModelWolf from './ModelWolf';

import ModelRain from './ModelRain';

// models

export const MODELS = _makeModelMap([
  ModelCrop,
  ModelCross,
  ModelTallgrass,
  ModelTallgrassDouble,
  ModelTallgrassDoubleSunflower,

  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelSlime,
  ModelWolf,

  ModelRain,
]);

// vegetations

export const VEGETATIONS = _makeVegetationSpecs([
  ModelCrop,
  ModelCross,
  ModelTallgrass,
  ModelTallgrassDouble,
  ModelTallgrassDoubleSunflower,
]);

// entities

export const ENTITIES = _makeEntitySpecs([
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelRain,
  ModelSlime,
  ModelWolf,
]);

// weathers

export const WEATHERS = _makeWeatherSpecs([
  ModelRain,
]);

// api

export function make(modelName, p = [], s = [], game) {
  const Model = MODELS[modelName];
  const model = new Model(p, s);
  return model.getMesh(game);
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

function _makeVegetationSpecs(models) {
  const result = [];
  models.forEach(model => {
    const {NAME, TEXTURES} = model;
    TEXTURES.forEach((texture, i) => {
      const spec = {
        model: NAME,
        p: [i],
        s: []
      };
      result.push(spec);
    });
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

function _makeWeatherSpecs(models) {
  return models.map(model => {
    const {NAME} = model;
    const spec = {
      model: NAME
    };
    return spec;
  });
}

