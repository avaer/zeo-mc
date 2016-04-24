"use strict";

const NAME = 'houseSmall';

const floor = Math.floor;
const random = Math.random;

const VARIANTS = {
  version1: [
    {
      legend: {
        'c': 'cobblestone',
        's': 'cobblestone-stairs',
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
        'c': 'cobblestone',
        's': 'cobblestone-stairs',
      },
      layout: [
        ['c', 'j', 'j', 'j', 'c'],
        ['j', ' ', ' ', 'H', 'j'],
        ['j', ' ', ' ', ' ', 'j'],
        ['j', ' ', ' ', ' ', 'j'],
        ['c', 'j', 'D', 'j', 'c'],
      ]
    },
    {
      legend: {
        'c': 'cobblestone',
        'j': 'oak-wood-planks',
        'g': 'glass-pane',
        'H': 'ladder',
        'D': 'door-oak-top',
      },
      layout: [
        ['c', 'j', 'g', 'j', 'c'],
        ['j', ' ', ' ', 'H', 'j'],
        ['g', ' ', ' ', ' ', 'g'],
        ['j', ' ', ' ', ' ', 'j'],
        ['c', 'j', 'D', 'j', 'c'],
      ]
    },
    {
      legend: {
        'c': 'cobblestone',
        'j': 'oak-wood-planks',
        'H': 'ladder',
        '!': 'torch',
      },
      layout: [
        ['c', 'j', 'j', 'j', 'c'],
        ['j', ' ', ' ', 'H', 'j'],
        ['j', ' ', ' ', ' ', 'j'],
        ['j', ' ', '!', ' ', 'j'],
        ['c', 'j', 'j', 'j', 'c'],
      ]
    },
    {
      legend: {
        'w': 'oak-wood',
        'j': 'oak-wood-planks',
        'H': 'ladder',
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
        'f': 'fence',
      },
      layout: [
        ['f', 'f', 'f', 'f', 'f'],
        ['f', ' ', ' ', ' ', 'f'],
        ['f', ' ', ' ', ' ', 'f'],
        ['f', ' ', ' ', ' ', 'f'],
        ['f', 'f', 'f', 'f', 'f'],
      ]
    },
  ],
  version2: [
    {
      legend: {
        'C': 'cobblestone',
        'D': 'dirt',
        'S': 'cobblestone-stairs',
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
        'W': 'oak-wood',
        'P': 'oak-wood-planks',
        'D': 'door-oak-bottom',
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
        'W': 'oak-wood',
        'P': 'oak-wood-planks',
        'D': 'door-oak-top',
        'G': 'glass-pane',
      },
      layout: [
        ['W', 'P', 'P', 'W'],
        ['P', ' ', ' ', 'P'],
        ['G', ' ', ' ', 'G'],
        ['G', ' ', ' ', 'G'],
        ['P', ' ', ' ', 'P'],
        ['W', 'D', 'P', 'W'],
      ],
    },
    {
      legend: {
        'W': 'oak-wood',
        'P': 'oak-wood-planks',
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
        'W': 'oak-wood',
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
        'W': 'oak-wood',
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
