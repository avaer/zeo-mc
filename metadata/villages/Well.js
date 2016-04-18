"use strict";

const LAYERS = [
  {
    legend: {
      'S': 'Cobblestone',
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
    'S': 'Cobblestone',
    'W': 'Water',
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
      'S': 'Cobblestone',
      'W': 'Water',
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
      'S': 'Cobblestone',
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
    'F': 'Fence',
  },
  layout: [
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'F', ' ', ' ', 'F', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'F', ' ', ' ', 'F', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
  ],
}, 2)).concat([
  {
    legend: {
      'S': 'Cobblestone',
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

function _repeat(e, n) {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = e;
  }
  return result;
}

module.exports = Well;
