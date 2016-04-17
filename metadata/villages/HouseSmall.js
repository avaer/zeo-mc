"use strict";

class HouseSmall {
  constructor(p) {
    p = p || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : 0;

    this.layers = [
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
    ];
  }
}

module.exports = HouseSmall;
