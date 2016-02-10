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
// import ModelSlime from './ModelSlime';
import ModelWolf from './ModelWolf';

import ModelRain from './ModelRain';

// vegetations

export const crop = ModelBase.make(ModelCrop);
export const cross = ModelBase.make(ModelCross);
export const tallgrass = ModelBase.make(ModelTallgrass);
export const tallgrassDouble = ModelBase.make(ModelTallgrassDouble);
export const tallgrassDoubleSunflower = ModelBase.make(ModelTallgrassDoubleSunflower);

export const VEGETATIONS = _makeVegetationSpecs([
  ModelCrop,
  ModelCross,
  ModelTallgrass,
  ModelTallgrassDouble,
  ModelTallgrassDoubleSunflower,
]);

// entities

export const chest = ModelBase.make(ModelChest);
export const chicken = ModelBase.make(ModelChicken);
export const cow = ModelBase.make(ModelCow);
export const creeper = ModelBase.make(ModelCreeper);
export const ocelot = ModelBase.make(ModelOcelot);
export const pig = ModelBase.make(ModelPig);
// export const slime = ModelBase.make(ModelSlime);
export const wolf = ModelBase.make(ModelWolf);

export const ENTITIES = _makeEntitySpecs([
  ModelChest,
  ModelChicken,
  ModelCow,
  ModelCreeper,
  ModelOcelot,
  ModelPig,
  ModelRain,
  // ModelSlime,
  ModelWolf,
]);

// weathers

export const rain = ModelBase.make(ModelRain);

export const WEATHERS = _makeWeatherSpecs([
  ModelRain,
]);

// helpers

function _makeVegetationSpecs(models) {
  const result = [];
  models.forEach(model => {
    const {NAME, TEXTURES} = model;
    TEXTURES.forEach((texture, i) => {
      const spec = {
        model: NAME,
        p: [i]
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
      p: []
    };
    return spec;
  });
}

function _makeWeatherSpecs(models) {
  return models.map(model => {
    const {NAME} = model;
    const spec = {
      model: NAME,
      p: []
    };
    return spec;
  });
}
