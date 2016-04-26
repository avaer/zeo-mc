"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'library';

const LAYERS = [
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'O': {type: BLOCKS['planks_oak']},
      'S': {type: BLOCKS['planks_oak'], model: 'stairs', direction: 'south'},
      'F': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'west'},
      'E': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'east'},
      'c': {type: BLOCKS['crafting_table_side']},
      'D': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'O', 'S', 'S', 'S', 'S', ' ', ' ', 'C'],
      ['C', 'S', 'F', ' ', 'E', ' ', ' ', ' ', 'C'],
      ['C', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', 'c', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'D', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'O': {type: BLOCKS['planks_oak']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
      'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
      'S': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'south'},
      'W': {type: BLOCKS['planks_oak'], model: 'pressure_plate_up'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'O', 'G', 'G', 'O', 'G', 'G', 'O', 'C'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['L', ' ', 'W', ' ', 'W', ' ', ' ', ' ', 'A'],
      ['L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['C', 'O', 'S', 'S', 'S', 'O', 'O', ' ', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'O': {type: BLOCKS['planks_oak']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
      'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
      'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'south'},
      'B': {type: BLOCKS['bookshelf']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'C'],
      ['O', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'O'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['C', 'O', 'A', 'A', 'A', 'O', 'O', 'O', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'O': {type: BLOCKS['planks_oak']},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['C', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'C'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'O'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['C', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'T': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'T': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'T': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
  {
    legend: {
      'C': {type: BLOCKS['cobblestone']},
      'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'T': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
  },
];

class Library {
  constructor() {
    this.layers = LAYERS;
  }
}
Library.NAME = NAME;

module.exports = Library;
