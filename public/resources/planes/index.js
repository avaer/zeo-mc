import PlaneCrop from './PlaneCrop';
import PlaneCross from './PlaneCross';
import PlaneTallgrass from './PlaneTallgrass';
import PlaneTallgrassDouble from './PlaneTallgrassDouble';
import PlaneTallgrassDoubleSunflower from './PlaneTallgrassDoubleSunflower';

import PlaneRain from './PlaneRain';

// planes

export const VEGETATIONS = _makeVegetationSpecs([
  PlaneCrop,
  PlaneCross,
  PlaneTallgrass,
  PlaneTallgrassDouble,
  PlaneTallgrassDoubleSunflower,
]);

export const WEATHERS = _makeWeatherSpecs([
  PlaneRain,
]);

export const PLANES = VEGETATIONS.concat(WEATHERS);

// helpers

function _makeVegetationSpecs(models) {
  const result = [];
  models.forEach(model => {
    const {NAME, MATERIALS} = model;
    MATERIALS.forEach((materials, i) => {
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

function _makeWeatherSpecs(models) {
  return models.map(model => {
    const {NAME} = model;
    const spec = {
      model: NAME
    };
    return spec;
  });
}
