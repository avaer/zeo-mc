"use strict";

const BlueprintBase = require('./BlueprintBase');

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
      'S': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'F': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'north'},
      'E': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'west'},
      'N': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'east'},
      'e': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'northwest'},
      'n': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'northeast'},
      'O': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
      'T': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
      'D': {type: BLOCKS['stone_slab_side']},
    },
    layout: [
      [' ', ' ', 'e', 'F', 'F', 'F', 'F', 'F', 'n'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', 'N'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'O', 'S', 'S'],
      ['S', 'P', 'T', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', 'T', 'F', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', 'D', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', 'D', ' ', 'S'],
      ['S', 'S', 'O', 'S', 'S', 'S', 'S', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'O': {type: BLOCKS['door_oak_upper'], model: 'door_top', direction: 'south'},
      'G': {type: BLOCKS['glass'], model: 'pane', direction: 'north'},
      'L': {type: BLOCKS['glass'], model: 'pane', direction: 'west'},
      'A': {type: BLOCKS['glass'], model: 'pane', direction: 'east'},
      'W': {type: BLOCKS['log_oak']},
      'R': {type: BLOCKS['planks_oak'], model: 'pressure_plate_up'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['S', 'P', 'G', 'G', 'P', 'P', 'O', 'P', 'S'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['L', ' ', 'R', ' ', ' ', ' ', ' ', ' ', 'A'],
      ['L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['S', 'P', 'O', 'P', 'P', 'G', 'P', 'P', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'S': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'north'},
      'T': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
      '!': {type: BLOCKS['torch_on'], model: 'torch_wall', direction: 'south'},
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

class ButcherShop extends BlueprintBase {
  constructor() {
    super();

    this.layers = LAYERS;
  }
}
ButcherShop.NAME = NAME;

module.exports = ButcherShop;
