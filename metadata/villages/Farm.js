"use strict";

const floor = Math.floor;
const random = Math.random;

const CROPS = [
  'seeds',
  'wheat',
  'carrots',
  'potato',
  'beetroot',
];

const VARIANTS = {
  small: cropType => ([
    {
      legend: {
        'W': 'wood',
        'F': 'farmland',
        '~': 'water',
      },
      layout: [
        ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      ]
    },
    {
      legend: {
        'C': CROPS[cropType],
      },
      layout: [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ]
    },
  ]),
  large: cropType => ([
    {
      legend: {
        'W': 'wood',
        'F': 'farmland',
        '~': 'water',
      },
      layout: [
        ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'F', 'F', '~', 'F', 'F', 'W', 'F', 'F', '~', 'F', 'F', 'W'],
        ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
      ]
    },
    {
      legend: {
        'C': CROPS[cropType],
      },
      layout: [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', 'C', 'C', ' ', 'C', 'C', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ]
    },
  ]),
};
const VARIANT_KEYS = Object.keys(VARIANTS);

class Farm {
  constructor(p) {
    p = p || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : floor(random() * VARIANT_KEYS.length);
    const p2 = typeof p[1] !== 'undefined' ? p[1] : floor(random() * CROPS.length);

    const variantIndex = p1 % VARIANT_KEYS.length;
    const variantKey = VARIANT_KEYS[variantIndex];
    const variantFn = VARIANTS[variantKey];
    const variant = variantFn(p2 % CROPS.length);
    this.layers = variant;
  }
}

module.exports = Farm;
