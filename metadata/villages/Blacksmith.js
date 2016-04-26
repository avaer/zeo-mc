"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'blacksmith';

const LAYERS = [
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
    },
    layout: [
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      [' ', 'S', 'S', 'S', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'W': {type: BLOCKS['log_oak']},
      'L': {type: BLOCKS['lava_still']},
      'S': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
      'F': {type: BLOCKS['planks_oak'], model: 'fence', direction: 'south'},
      'D': {type: BLOCKS['stone_slab_side']},
      'Q': {type: BLOCKS['log_oak']}, // XXX Chest
    },
    layout: [
      ['C', 'C', 'C', 'C', 'P', 'P', 'P', 'P', 'P', 'W'],
      ['C', 'L', 'L', 'C', 'Q', ' ', ' ', 'S', 'P', 'P'],
      ['C', 'C', 'C', 'C', ' ', ' ', ' ', 'F', 'S', 'P'],
      [' ', ' ', ' ', 'C', 'P', 'P', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'P'],
      [' ', 'D', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['F', ' ', ' ', ' ', 'F', ' ', 'W', 'P', 'P', 'W'],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'G': {type: BLOCKS['glass'], model: 'pane', direction: 'north'},
      'L': {type: BLOCKS['glass'], model: 'pane', direction: 'east'},
      'I': {type: BLOCKS['iron_bars'], model: 'bars', direction: 'west'},
      'W': {type: BLOCKS['log_oak']},
      'F': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'south'},
      'E': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'southwest'},
      'B': {type: BLOCKS['furnace_side']},
      'R': {type: BLOCKS['planks_oak'], model: 'pressure_plate'},
    },
    layout: [
      ['C', 'C', 'C', 'C', 'P', 'G', 'P', 'G', 'P', 'W'],
      ['I', ' ', ' ', 'C', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['I', ' ', ' ', 'C', ' ', ' ', ' ', 'R', ' ', 'L'],
      [' ', ' ', ' ', 'B', 'P', 'P', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'L'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['E', ' ', ' ', ' ', 'F', ' ', 'W', 'P', 'P', 'W'],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'P': {type: BLOCKS['planks_oak']},
      'W': {type: BLOCKS['log_oak']},
      'F': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'south'},
      'E': {type: BLOCKS['planks_oak'], model: 'fence_ne', direction: 'southwest'},
      'B': {type: BLOCKS['furnace_side']},
    },
    layout: [
      ['C', 'C', 'C', 'C', 'P', 'P', 'P', 'P', 'P', 'W'],
      ['C', 'C', 'C', 'C', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['C', 'C', 'C', 'C', ' ', ' ', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', 'B', 'P', 'P', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'P'],
      ['E', ' ', ' ', ' ', 'F', ' ', 'W', 'P', 'P', 'W'],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'W': {type: BLOCKS['log_oak']},
    },
    layout: [
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'W'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'W', 'C', 'C', 'W'],
    ],
  },
  {
    legend: {
      '$': {type: BLOCKS['cobblestone']},
    },
    layout: [
      ['$', '$', '$', '$', '$', '$', '$', '$', '$', '$'],
      ['$', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '$'],
      ['$', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '$'],
      ['$', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '$'],
      ['$', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '$'],
      ['$', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '$'],
      ['$', '$', '$', '$', '$', '$', '$', '$', '$', '$'],
    ],
  },
];

class Blacksmith {
  constructor() {
    this.layers = LAYERS;
  }
}
Blacksmith.NAME = NAME;

module.exports = Blacksmith;
