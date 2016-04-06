"use strict";

const PlaneBase = require('./PlaneBase');
const constants = require('../../constants/index');
const BIOME_TEXTURES = constants.BIOME_TEXTURES;

const NAME = 'tallgrassDouble';

function _doubleTexture(texture) {
  return [texture, texture];
}

function _doublePlantName(plantName) {
  return ['double_plant_' + plantName + '_bottom', 'double_plant_' + plantName + '_top'];
}

function _expandBiomes(plantNames) {
  const result = [];
  plantNames.forEach(plantNames => {
    BIOME_TEXTURES.forEach(biomeTexture => {
      const biomedPlantNames = plantNames.map(plantName => plantName + '_' + biomeTexture);
      result.push(biomedPlantNames);
    });
  });
  return result;
}

const MATERIALS = [].concat([
  'reeds'
].map(_doubleTexture)).concat([
  'paeonia',
  'rose',
  'syringa',
].map(_doublePlantName)).concat(_expandBiomes([
  'fern',
  'grass',
].map(_doublePlantName)));

const SIZE = 1;

class PlaneTallgrassDouble extends PlaneBase {
  constructor(p) {
    p = p || [];
    const p1 = p[0];

    super([], []);

    const materialIndex = p1;
    this.materials = MATERIALS[materialIndex];

    const offset = [0, 0, 16, 16];
    const bottomPosition = [0, 0, 0];
    const topPosition = [0, SIZE, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'tallgrassDoubleBottom1',
        offset: offset,
        position: bottomPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0],
        materialIndex: 0
      },
      {
        name: 'tallgrassDoubleBottom2',
        offset: offset,
        position: bottomPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0],
        materialIndex: 0
      },
      {
        name: 'tallgrassDoubleTop1',
        offset: offset,
        position: topPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0],
        materialIndex: 1
      },
      {
        name: 'tallgrassDoubleTop2',
        offset: offset,
        position: topPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0],
        materialIndex: 1
      },
    ]
  }
}
PlaneTallgrassDouble.NAME = NAME;
PlaneTallgrassDouble.MATERIALS = MATERIALS;

module.exports = PlaneTallgrassDouble;

// XXX
// var m; function go() {game.scene.remove(m); m = MODELS.make('tallgrassDouble', [], [], game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
