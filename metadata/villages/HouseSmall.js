"use strict";

const NAME = 'houseSmall';

const floor = Math.floor;
const random = Math.random;

const VARIANTS = {
  version1: [
    {
      legend: {
        'c': {type: BLOCKS['cobblestone']},
        's': {type: BLOCKS['cobblestone'], model: 'stairs'},
      },
      layout: [
        ['c', 'c', 'c', 'c', 'c'],
        ['c', 'c', 'c', 'c', 'c'],
        ['c', 'c', 'c', 'c', 'c'],
        ['c', 'c', 'c', 'c', 'c'],
        ['c', 'c', 'c', 'c', 'c'],
        [' ', ' ', 's', ' ', ' '],
      ]
    },
    {
      legend: {
        'c': {type: BLOCKS['cobblestone']},
        'p': {type: BLOCKS['planks_oak']},
        's': {type: BLOCKS['cobblestone'], model: 'stairs'},
        'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
        'D': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
      },
      layout: [
        ['c', 'p', 'p', 'p', 'c'],
        ['p', ' ', ' ', 'H', 'p'],
        ['p', ' ', ' ', ' ', 'p'],
        ['p', ' ', ' ', ' ', 'p'],
        ['c', 'p', 'D', 'p', 'c'],
      ]
    },
    {
      legend: {
        'c': {type: BLOCKS['cobblestone']},
        'p': {type: BLOCKS['planks_oak']},
        'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'north'},
        'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
        'A': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
        'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
        'D': {type: BLOCKS['door_oak_upper'], model: 'door_upper', direction: 'south'},
      },
      layout: [
        ['c', 'p', 'G', 'p', 'c'],
        ['p', ' ', ' ', 'H', 'p'],
        ['L', ' ', ' ', ' ', 'A'],
        ['p', ' ', ' ', ' ', 'p'],
        ['c', 'p', 'D', 'p', 'c'],
      ]
    },
    {
      legend: {
        'c': {type: BLOCKS['cobblestone']},
        'p': {type: BLOCKS['planks_oak']},
        'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
        '!': {type: BLOCKS['torch_on'], model: 'torch_wall', direction: 'north'},
      },
      layout: [
        ['c', 'p', 'p', 'p', 'c'],
        ['p', ' ', ' ', 'H', 'p'],
        ['p', ' ', ' ', ' ', 'p'],
        ['p', ' ', '!', ' ', 'p'],
        ['c', 'p', 'p', 'p', 'c'],
      ]
    },
    {
      legend: {
        'w': {type: BLOCKS['log_oak']},
        'p': {type: BLOCKS['planks_oak']},
        'H': {type: BLOCKS['ladder'], model: 'ladder', direction: 'south'},
      },
      layout: [
        ['w', 'w', 'w', 'w', 'w'],
        ['w', 'j', 'j', 'H', 'w'],
        ['w', 'j', 'j', 'j', 'w'],
        ['w', 'j', 'j', 'j', 'w'],
        ['w', 'w', 'w', 'w', 'w'],
      ]
    },
    {
      legend: {
        'F': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'north'},
        'E': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'west'},
        'N': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'east'},
        'C': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'south'},
        'f': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'northwest'},
        'e': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'northeast'},
        'n': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'southwest'},
        'c': {type: BLOCKS['planks_oak'], model: 'fence_ns', direction: 'southeast'},
      },
      layout: [
        ['f', 'F', 'F', 'F', 'e'],
        ['E', ' ', ' ', ' ', 'N'],
        ['E', ' ', ' ', ' ', 'N'],
        ['E', ' ', ' ', ' ', 'N'],
        ['n', 'C', 'C', 'C', 'c'],
      ]
    },
  ],
  version2: [
    {
      legend: {
        'c': {type: BLOCKS['cobblestone']},
        'D': {type: BLOCKS['dirt']},
        'S': {type: BLOCKS['cobblestone'], model: 'stairs', direction: 'south'},
      },
      layout: [
        ['C', 'C', 'C', 'C'],
        ['C', 'D', 'D', 'C'],
        ['C', 'D', 'D', 'C'],
        ['C', 'D', 'D', 'C'],
        ['C', 'C', 'C', 'C'],
        [' ', 'S', ' ', ' '],
      ],
    },
    {
      legend: {
        'W': {type: BLOCKS['log_oak']},
        'P': {type: BLOCKS['planks_oak']},
        'D': {type: BLOCKS['door_oak_lower'], model: 'door_lower', direction: 'south'},
      },
      layout: [
        ['W', 'P', 'P', 'W'],
        ['P', ' ', ' ', 'P'],
        ['P', ' ', ' ', 'P'],
        ['P', ' ', ' ', 'P'],
        ['W', 'D', 'P', 'W'],
      ],
    },
    {
      legend: {
        'W': {type: BLOCKS['log_oak']},
        'P': {type: BLOCKS['planks_oak']},
        'G': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'west'},
        'L': {type: BLOCKS['glass'], model: 'glass_pane_ns', direction: 'east'},
        'D': {type: BLOCKS['door_oak_upper'], model: 'door_upper', direction: 'south'},
      },
      layout: [
        ['W', 'P', 'P', 'W'],
        ['P', ' ', ' ', 'P'],
        ['G', ' ', ' ', 'L'],
        ['G', ' ', ' ', 'L'],
        ['P', ' ', ' ', 'P'],
        ['W', 'D', 'P', 'W'],
      ],
    },
    {
      legend: {
        'W': {type: BLOCKS['log_oak']},
        'P': {type: BLOCKS['planks_oak']},
      },
      layout: [
        ['W', 'P', 'P', 'W'],
        ['P', ' ', ' ', 'P'],
        ['P', ' ', ' ', 'P'],
        ['P', ' ', ' ', 'P'],
        ['W', 'P', 'P', 'W'],
      ],
    },
    {
      legend: {
        'W': {type: BLOCKS['log_oak']},
      },
      layout: [
        [' ', 'W', 'W', ' '],
        ['W', ' ', ' ', 'W'],
        ['W', ' ', ' ', 'W'],
        ['W', ' ', ' ', 'W'],
        [' ', 'W', 'W', ' '],
      ],
    },
    {
      legend: {
        'W': {type: BLOCKS['log_oak']},
      },
      layout: [
        [' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' '],
        [' ', 'W', 'W', ' '],
        [' ', 'W', 'W', ' '],
        [' ', ' ', ' ', ' ']
      ],
    }
  ]
};
const VARIANT_KEYS = Object.keys(VARIANTS);

class HouseSmall {
  constructor(p) {
    p = p || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : floor(random() * VARIANT_KEYS.length);

    const variantIndex = p1 % VARIANT_KEYS.length;
    const variantKey = VARIANT_KEYS[variantIndex];
    const variant = VARIANTS[variantKey];
    this.layers = variant;
  }
}
HouseSmall.NAME = NAME;

module.exports = HouseSmall;
