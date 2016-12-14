"use strict";

const BlueprintBase = require('./BlueprintBase');

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'well';

const LAYERS = [
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
].concat(_repeat({
  legend: {
    'S': {type: BLOCKS['cobblestone']},
    'W': {type: BLOCKS['water_still']},
  },
  layout: [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'S', 'S', 'S', 'S', ' '],
    [' ', 'S', 'W', 'W', 'S', ' '],
    [' ', 'S', 'W', 'W', 'S', ' '],
    [' ', 'S', 'S', 'S', 'S', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
  ],
}, 10)).concat([
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
      'W': {type: BLOCKS['water_still']},
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S'],
      ['S', 'S', 'W', 'W', 'S', 'S'],
      ['S', 'S', 'W', 'W', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S'],
    ],
  },
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', ' ', ' ', 'S', ' '],
      [' ', 'S', ' ', ' ', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
]).concat(_repeat({
  legend: {
    'F': {type: BLOCKS['planks_oak'], model: 'fence_post'},
    'E': {type: BLOCKS['planks_oak'], model: 'fence_post'},
    'N': {type: BLOCKS['planks_oak'], model: 'fence_post'},
    'C': {type: BLOCKS['planks_oak'], model: 'fence_post'},
  },
  layout: [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'F', ' ', ' ', 'E', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'N', ' ', ' ', 'C', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
  ],
}, 2)).concat([
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', 'S', 'S', 'S', 'S', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
]);

class Well extends BlueprintBase {
  constructor() {
    super();

    this.layers = LAYERS;
    this.yOffset = -11;
  }
}
Well.NAME = NAME;

function _repeat(e, n) {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = e;
  }
  return result;
}

module.exports = Well;
