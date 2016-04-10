"use strict";

const PlaneBase = require('./PlaneBase');

const OUTER_SIZE = 1;
const INNER_SIZE = OUTER_SIZE / 2;

const NAME = 'fire';
const MATERIALS = [
  [
    'fire_layer_0',
    'fire_layer_1',
  ]
];

class PlaneFire extends PlaneBase {
  constructor(p, s) {
    s = s || [];
    const s1 = typeof s[0] !== 'undefined' ? s[0] : 0;
    const s2 = typeof s[1] !== 'undefined' ? s[1] : 1;

    super([], [s1, s2]);

    const outerDimensions = [OUTER_SIZE, OUTER_SIZE];
    const innerDimensions = [INNER_SIZE, INNER_SIZE];

    const materialIndex = 0;
    this.materials = MATERIALS[0];
    this.meshes = [
      {
        name: 'outerFire1',
        position: [-OUTER_SIZE/2, 0, 0],
        dimensions: outerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, -Math.PI/2, 0],
        materialIndex: 0
      },
      {
        name: 'outerFire2',
        position: [OUTER_SIZE/2, 0, 0],
        dimensions: outerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI/2, 0],
        materialIndex: 0
      },
      {
        name: 'outerFire3',
        position: [0, 0, -OUTER_SIZE/2],
        dimensions: outerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, 0, 0],
        materialIndex: 0
      },
      {
        name: 'outerFire4',
        position: [0, 0, OUTER_SIZE/2],
        dimensions: outerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI, 0],
        materialIndex: 0
      },
      {
        name: 'innerFire1',
        position: [INNER_SIZE/2 - INNER_SIZE/2, 0, INNER_SIZE/2],
        dimensions: innerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, -Math.PI/2, 0],
        materialIndex: 0
      },
      {
        name: 'innerFire2',
        position: [INNER_SIZE/2 + INNER_SIZE/2, 0, INNER_SIZE/2],
        dimensions: innerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI/2, 0],
        materialIndex: 0
      },
      {
        name: 'innerFire3',
        position: [INNER_SIZE/2, 0, INNER_SIZE/2 - INNER_SIZE/2],
        dimensions: innerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, 0, 0],
        materialIndex: 0
      },
      {
        name: 'innerFire4',
        position: [INNER_SIZE/2, 0, INNER_SIZE/2 + INNER_SIZE/2],
        dimensions: innerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI, 0],
        materialIndex: 0
      },
    ]
  }
}
PlaneFire.NAME = NAME;
PlaneFire.MATERIALS = MATERIALS;

module.exports = PlaneFire;

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('rain', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += (1 / 50))}, 50);
