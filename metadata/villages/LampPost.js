"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const NAME = 'lampPost';

const LAYERS = _repeat({
  legend: {
    'F': {type: BLOCKS['planks_oak'], model: 'fence_post'},
  },
  layout: [
    [' ', ' ', ' '],
    [' ', 'F', ' '],
    [' ', ' ', ' '],
  ],
}, 3).concat([
  {
    legend: {
      't': {type: BLOCKS['torch_on'], model: 'torch_wall', direction: 'north'},
      'o': {type: BLOCKS['torch_on'], model: 'torch_wall', direction: 'south'},
      'r': {type: BLOCKS['torch_on'], model: 'torch_wall', direction: 'west'},
      'c': {type: BLOCKS['torch_on'], model: 'torch_wall', direction: 'east'},
      'B': {type: BLOCKS['wool_colored_black']},
    },
    layout: [
      [' ', 't', ' '],
      ['o', 'B', 'r'],
      [' ', 'c', ' '],
    ],
  }
]);

class LampPost {
  constructor() {
    this.layers = LAYERS;
  }
}
LampPost.NAME = NAME;

function _repeat(e, n) {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = e;
  }
  return result;
}

module.exports = LampPost;
