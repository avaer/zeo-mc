"use strict";

const LAYERS = _repeat({
  legend: {
    'F': 'Fence',
  },
  layout: [
    [' ', ' ', ' '],
    [' ', 'F', ' '],
    [' ', ' ', ' '],
  ],
}, 3).concat([
  {
    legend: {
      'T': 'Torch',
      'B': 'Black Wool',
    },
    layout: [
      [' ', 'T', ' '],
      ['T', 'B', 'T'],
      [' ', 'T', ' '],
    ],
  }
]);

class LampPost {
  constructor() {
    this.layers = LAYERS;
  }
}

function _repeat(e, n) {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = e;
  }
  return result;
}

module.exports = LampPost;
