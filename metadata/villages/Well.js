"use strict";

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
    'F': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'northwest'},
    'E': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'northeast'},
    'N': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'southwest'},
    'C': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'southeast'},
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

class Well {
  constructor() {
    this.layers = LAYERS;
    this.offset = -11;
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
