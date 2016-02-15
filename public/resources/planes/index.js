import PlaneCrop from './PlaneCrop';
import PlaneCross from './PlaneCross';
import PlaneTallgrass from './PlaneTallgrass';
import PlaneTallgrassDouble from './PlaneTallgrassDouble';
import PlaneTallgrassDoubleSunflower from './PlaneTallgrassDoubleSunflower';

import PlaneRain from './PlaneRain';

// planes

export const PLANES = _makePlaneMap([
  PlaneCrop,
  PlaneCross,
  PlaneTallgrass,
  PlaneTallgrassDouble,
  PlaneTallgrassDoubleSunflower,
  PlaneRain,
]);

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

// api

export function make(planeName, p = [], s = []) {
  const Plane = PLANES[planeName];
  const plane = new Plane(p, s);
  return plane;
}

// helpers

function _makePlaneMap(planes) {
  const result = {};
  planes.forEach(plane => {
    const {NAME} = plane;
    result[NAME] = plane;
  });
  return result;
}

function _makeVegetationSpecs(planes) {
  const result = [];
  planes.forEach(plane => {
    const {NAME, MATERIALS} = plane;
    MATERIALS.forEach((materials, i) => {
      const spec = {
        plane: NAME,
        p: [i],
        s: []
      };
      result.push(spec);
    });
  });
  return result;
}

function _makeWeatherSpecs(planes) {
  return planes.map(plane => {
    const {NAME} = plane;
    const spec = {
      plane: NAME
    };
    return spec;
  });
}
