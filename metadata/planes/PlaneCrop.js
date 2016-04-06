"use strict";

const PlaneBase = require('./PlaneBase');
const constants = require('../../constants/index');
const BIOME_TEXTURES = constants.BIOME_TEXTURES;

const NAME = 'crop';

function _stages(name, stages) {
  const result = [];
  for (let i = 0; i <= stages; i++) {
    result.push(name + '_stage_' + i);
  }
  return result;
}

const MATERIALS = [].concat(
  _stages('carrots', 3)
).concat(
  _stages('nether_wart', 2)
).concat(
  _stages('potatoes', 3)
).concat(
  _stages('wheat', 7)
);

const SIZE = 1;

class PlaneCrop extends PlaneBase {
  constructor(p) {
    p = p || [];
    const p1 = p[0];

    super([], []);

    const materialIndex = p1;
    this.materials = MATERIALS[materialIndex];

    const offset = [0, 0, 16, 16];
    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'cross1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'cross2',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0]
      },
    ]
  }
}
PlaneCrop.NAME = NAME;
PlaneCrop.MATERIALS = MATERIALS;

module.exports = PlaneCrop;

// XXX
// var m; function go() {game.scene.remove(m); m = MODELS.make('crop', [], [], game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
