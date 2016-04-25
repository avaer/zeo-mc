"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'butcherShop';

const LAYERS = [
  {
    legend: {
      'D': {type: BLOCKS['dirt']},
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'T': {type: BLOCKS['stone_slab_side']},
    },
    layout: [
      [' ', ' ', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      [' ', ' ', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      [' ', ' ', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      [' ', ' ', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      [' ', ' ', 'D', 'D', 'D', 'D', 'C', 'D', 'D'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C'],
      ['C', 'P', 'P', 'P', 'P', 'T', 'T', 'T', 'C'],
      ['C', 'P', 'P', 'P', 'P', 'T', 'T', 'T', 'C'],
      ['C', 'P', 'P', 'P', 'P', 'T', 'T', 'T', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      [' ', ' ', 'S', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'F': {type: BLOCKS['planks_oak'], model: 'fence', direction: 'north'},
      'E': {type: BLOCKS['planks_oak'], model: 'fence', direction: 'west'},
      'N': {type: BLOCKS['planks_oak'], model: 'fence', direction: 'east'},
      'O': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
      'T': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
      'D': {type: BLOCKS['stone_slab_side']},
    },
    layout: [
      [' ', ' ', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'O', 'C', 'C'],
      ['C', 'P', 'T', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', 'T', 'F', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', 'D', ' ', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', 'D', ' ', 'C'],
      ['C', 'C', 'O', 'C', 'C', 'C', 'C', 'C', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'O': {type: BLOCKS['door_oak_upper'], model: 'door_upper', direction: 'south'},
      'G': {type: BLOCKS['glass'], model: 'pane', direction: 'north'},
      'L': {type: BLOCKS['glass'], model: 'pane', direction: 'west'},
      'A': {type: BLOCKS['glass'], model: 'pane', direction: 'east'},
      'W': {type: BLOCKS['log_oak']},
      'R': {type: BLOCKS['planks_oak'], model: 'pressure_plate'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'P', 'G', 'G', 'P', 'P', 'O', 'P', 'C'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['L', ' ', 'R', ' ', ' ', ' ', ' ', ' ', 'A'],
      ['L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['C', 'P', 'O', 'P', 'P', 'G', 'P', 'P', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'S': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'north'},
      'T': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
      '!': {type: BLOCKS['torch_on'], model: 'torch', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['C', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', '!', ' ', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', ' ', '!', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C'],
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
    ],
  },
  {
    legend: {
      'P': {type: BLOCKS['planks_oak']},
      'S': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'north'},
      'T': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'P': {type: BLOCKS['planks_oak']},
      'S': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'north'},
      'T': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
];

class ButcherShop {
  constructor() {
    this.layers = LAYERS;
  }
}
ButcherShop.NAME = NAME;

module.exports = ButcherShop;
