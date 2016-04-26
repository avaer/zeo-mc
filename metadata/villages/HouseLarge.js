"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'houseLarge';

const LAYERS = [
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
      's': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      'P': {type: BLOCKS['planks_oak']},
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', ' ', ' '],
      ['S', 'P', 'P', 'P', 'P', 'P', 'S', 'S', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', 's', ' ', ' '],
    ]
  },
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
      'D': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'D', 'S', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
      'W': {type: BLOCKS['log_oak']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
      'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
      'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'south'},
      'P': {type: BLOCKS['planks_oak']},
      'D': {type: BLOCKS['door_oak_upper'], model: 'door_upper', direction: 'south'},
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', ' '],
      ['W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      ['G', ' ', ' ', ' ', ' ', ' ', 'L', ' ', ' '],
      ['G', ' ', ' ', ' ', ' ', ' ', 'L', ' ', ' '],
      ['W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      ['P', ' ', ' ', ' ', ' ', ' ', 'P', 'P', 'S'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L'],
      ['G', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L'],
      ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
      ['S', 'P', 'W', 'A', 'W', 'P', 'D', 'P', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'S': {type: BLOCKS['cobblestone']},
      's': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      't': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'east'},
      'a': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
      'P': {type: BLOCKS['planks_oak']},
      '!': {type: BLOCKS['torch'], model: 'toch_wall', direction: 'north'},
    },
    layout: [
      ['S', 'S', 'S', 'S', 'S', 'S', 'S', 't', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 't', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 't', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 't', ' '],
      ['S', ' ', ' ', ' ', ' ', ' ', 'S', 'P', 'a'],
      ['S', ' ', ' ', ' ', ' ', ' ', 'P', 'P', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S'],
      ['S', ' ', ' ', ' ', ' ', ' ', '!', ' ', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'D', 'S', 'S'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
    ]
  },
  {
    legend: {
      'W': {type: BLOCKS['log_oak']},
      'P': {type: BLOCKS['planks_oak']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      's': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      't': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'west'},
      'a': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'east'},
      'u': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      ['t', 'P', 'W', 'G', 'W', 'P', 'a', ' ', ' '],
      ['t', 'P', ' ', ' ', ' ', 'P', 'a', ' ', ' '],
      ['t', 'P', ' ', ' ', ' ', 'P', 'a', ' ', ' '],
      ['t', 'P', ' ', ' ', ' ', 'P', 'a', ' ', ' '],
      ['t', 'P', ' ', ' ', ' ', 'P', 'a', ' ', ' '],
      ['t', 'P', ' ', ' ', ' ', 'P', 'P', 'i', 'i'],
      ['P', 'P', ' ', ' ', ' ', 'P', 'P', 'P', 'P'],
      ['P', 'P', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['P', 'P', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'W': {type: BLOCKS['log_oak']},
      'P': {type: BLOCKS['planks_oak']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      's': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      't': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'west'},
      'a': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'east'},
      'i': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      [' ', 't', 'P', 'P', 'P', 'a', ' ', ' ', ' '],
      [' ', 't', 'P', ' ', 'P', 'a', ' ', ' ', ' '],
      [' ', 't', 'P', ' ', 'P', 'a', ' ', ' ', ' '],
      [' ', 't', 'P', ' ', 'P', 'a', ' ', ' ', ' '],
      [' ', 't', 'P', ' ', 'P', 'a', ' ', ' ', ' '],
      [' ', 't', 'P', ' ', 'P', 'a', ' ', ' ', ' '],
      ['i', 'P', 'P', ' ', 'P', 'P', 'i', 'i', 'i'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
  {
    legend: {
      'W': {type: BLOCKS['log_oak']},
      'P': {type: BLOCKS['planks_oak']},
      'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
      's': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      't': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'west'},
      'a': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'east'},
      'i': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'north'},
    },
    layout: [
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      [' ', 't', 'P', 'a', ' ', ' ', ' ', ' ', ' '],
      ['i', 'i', 'P', 'P', 'P', 'i', 'i', 'i', 'i'],
      ['s', 's', 's', 's', 's', 's', 's', 's', 's'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
  },
];

class HouseLarge {
  constructor() {
    this.layers = LAYERS;
  }
}
HouseLarge.NAME = NAME;

module.exports = HouseLarge;
