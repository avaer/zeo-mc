const PlaneCrop = require('./PlaneCrop');
const PlaneCross = require('./PlaneCross');
const PlaneTallgrass = require('./PlaneTallgrass');
const PlaneTallgrassDouble = require('./PlaneTallgrassDouble');
const PlaneTallgrassDoubleSunflower = require('./PlaneTallgrassDoubleSunflower');

const PlaneRain = require('./PlaneRain'); // XXX refaactor this to account for particles

const PlaneFire = require('./PlaneFire');

// planes

api.PLANES = _makePlaneMap([
  PlaneCrop,
  PlaneCross,
  PlaneTallgrass,
  PlaneTallgrassDouble,
  PlaneTallgrassDoubleSunflower,

  PlaneRain,

  PlaneFire,
]);

api.VEGETATIONS = _makeVegetationSpecs([
  PlaneCrop,
  PlaneCross,
  PlaneTallgrass,
  PlaneTallgrassDouble,
  PlaneTallgrassDoubleSunflower,
]);

api.WEATHERS = _makeWeatherSpecs([
  PlaneRain,
]);

api.EFFECTS = _makeEffectSpecs([
  PlaneFire,
]);

// makers

api.make = function(planeName, p, s) {
  p = p || [];
  s = s || [];

  const Plane = api.PLANES[planeName];
  const plane = new Plane(p, s);
  return plane;
};

module.exports = api;

// helpers

function _makePlaneMap(planes) {
  const result = {};
  planes.forEach(plane => {
    const NAME = plane.NAME;
    result[NAME] = plane;
  });
  return result;
}

function _makeVegetationSpecs(planes) {
  const result = [];
  planes.forEach(plane => {
    const NAME = plane.NAME;
    const MATERIALS = plane.MATERIALS;
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
    const NAME = plane.NAME;
    const spec = {
      plane: NAME
    };
    return spec;
  });
}

function _makeEffectSpecs(planes) {
  return planes.map(plane => {
    const NAME = plane.NAME;
    const spec = {
      plane: NAME
    };
    return spec;
  });
}
