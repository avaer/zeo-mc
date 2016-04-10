"use strict";

const PlaneBase = require('./PlaneBase');

const SIZE = 1;

const NAME = 'rain';
const MATERIALS = [
  [
    'rain1',
    'rain2',
    'rain3',
    'rain4'
  ]
];

class PlaneRain extends PlaneBase {
  constructor(p, s) {
    s = s || [];
    const s1 = typeof s[0] !== 'undefined' ? s[0]: 0;
    const s2 = typeof s[1] !== 'undefined' ? s[1]: 1;

    super([], [s1, s2]);

    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE];

    const materialIndex = 0;
    this.materials = MATERIALS[0];
    this.meshes = [
      {
        name: 'rain1',
        // offset: [0, 0 + 64 * 0, 64, 0 + 64 * 1],
        position: position,
        dimensions: dimensions,
        // rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 0, 0],
        materialIndex: 0
      },
      /* {
        name: 'rain2',
        offset: [0, 0 + 64 * 1, 64, 0 + 64 * 2],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 1, 0],
        materialIndex: 1
      }, */
      {
        name: 'rain3',
        // offset: [0, 0 + 64 * 2, 64, 0 + 64 * 3],
        position: position,
        dimensions: dimensions,
        // rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 2, 0],
        materialIndex: 2
      },
      /* {
        name: 'rain4',
        offset: [0, 0 + 64 * 3, 64, 0 + 64 * 4],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 3, 0],
        materialIndex: 3
      }, */
    ]
  }
}
PlaneRain.NAME = NAME;
PlaneRain.MATERIALS = MATERIALS;

module.exports = PlaneRain;

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('rain', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += (1 / 50))}, 50);
