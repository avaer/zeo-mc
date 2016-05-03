"use strict";

const BlueprintBase = require('./BlueprintBase');

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'church';

const LAYERS = [
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
    },
    layout: [
      [' ', 'C', 'C', 'C', ' '],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      [' ', 'C', 'C', 'C', ' '],
      [' ', 'C', 'C', 'C', ' '],
      [' ', 'C', 'C', 'C', ' '],
      [' ', 'C', 'C', 'C', ' '],
      [' ', ' ', 'S', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
      'D': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
    },
    layout: [
      [' ', 'C', 'C', 'C', ' '],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'S', 'C', 'C'],
      ['C', 'S', ' ', 'S', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', 'H', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', 'C', 'D', 'C', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
      'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
      'D': {type: BLOCKS['door_oak_upper'], model: 'door_upper', direction: 'south'},
    },
    layout: [
      [' ', 'C', 'C', 'C', ' '],
      ['C', 'S', ' ', 'S', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', 'H', ' ', ' ', 'C'],
      ['G', ' ', ' ', ' ', 'L'],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', 'C', 'D', 'C', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
      'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
    },
    layout: [
      [' ', 'C', 'G', 'C', ' '],
      ['C', ' ', ' ', ' ', 'C'],
      ['L', ' ', ' ', ' ', 'A'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', 'H', ' ', ' ', 'C'],
      ['L', ' ', ' ', ' ', 'A'],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', 'C', 'C', 'C', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
    },
    layout: [
      [' ', 'C', 'C', 'C', ' '],
      ['C', ' ', 'T', ' ', 'C'],
      ['C', 'T', ' ', 'T', 'C'],
      ['C', ' ', 'T', ' ', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'H', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' '],
      [' ', 'C', 'C', 'C', ' '],
      [' ', 'C', 'C', 'C', ' '],
      [' ', 'C', 'C', 'C', ' '],
      [' ', 'C', 'C', 'C', ' '],
      ['C', 'H', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', 'C', 'C', 'C', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
].concat(_repeat({
  legend: {
    'C': {type: BLOCKS['cobblestone']},
    'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
    'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
    'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
    'S': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'south'},
    'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
  },
  layout: [
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', 'C', 'G', 'C', ' '],
    ['C', 'H', ' ', ' ', 'C'],
    ['L', ' ', ' ', ' ', 'A'],
    ['C', ' ', ' ', ' ', 'C'],
    [' ', 'C', 'S', 'C', ' '],
    [' ', ' ', ' ', ' ', ' '],
  ],
}, 2)).concat([
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
      'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
      'S': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', 'C', 'G', 'C', ' '],
      ['C', 'H', ' ', ' ', 'C'],
      ['L', ' ', ' ', ' ', 'A'],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', 'C', 'S', 'C', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'H', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C'],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', 'C', 'C', 'C', ' '],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', 'C', 'C', 'C', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'C', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      ['C', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'C', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
    ],
  },
]);

class Church extends BlueprintBase {
  constructor() {
    super();

    this.layers = LAYERS;
  }
}
Church.NAME = NAME;

function _repeat(e, n) {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = e;
  }
  return result;
}

module.exports = Church;
