"use strict";

const BlueprintBase = require('./BlueprintBase');

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'farm';

const floor = Math.floor;
const random = Math.random;

const CROPS = [
  BLOCKS['wheat_stage_0'],
  BLOCKS['carrots_stage_0'],
  BLOCKS['potatoes_stage_0'],
  BLOCKS['beetrootss_stage_0'],
];

const VARIANTS = {
  small: cropType => ([
    {
      legend: {
        'W': {type: BLOCKS['log_oak']},
        'F': {type: BLOCKS['farmland_dry']},
        '~': {type: BLOCKS['water_still']},
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
        'C': {type: CROPS[cropType], model: 'crop'},
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
        'W': {type: BLOCKS['log_oak']},
        'F': {type: BLOCKS['farmland_dry']},
        '~': {type: BLOCKS['water_Still']},
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
        'C': {type: CROPS[cropType], model: 'crop'},
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

class Farm extends BlueprintBase {
  constructor(p) {
    super();

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
Farm.NAME = NAME;

module.exports = Farm;
