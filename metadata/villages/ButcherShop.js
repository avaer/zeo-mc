"use strict";

const LAYERS = [
  {
    legend: {
      'D': 'Dirt',
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'S': 'Cobblestone Stairs',
      'T': 'Stone Slab Top',
    },
    layout: [
      [' ',' ','D','D','D','D','D','D','D'],
      [' ',' ','D','D','D','D','D','D','D'],
      [' ',' ','D','D','D','D','D','D','D'],
      [' ',' ','D','D','D','D','D','D','D'],
      [' ',' ','D','D','D','D','C','D','D'],
      ['C','C','C','C','C','C','C','C','C'],
      ['C','P','P','P','P','P','P','P','C'],
      ['C','P','P','P','P','T','T','T','C'],
      ['C','P','P','P','P','T','T','T','C'],
      ['C','P','P','P','P','T','T','T','C'],
      ['C','C','C','C','C','C','C','C','C'],
      [' ',' ','S',' ',' ',' ',' ',' ',' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'S': 'Cobblestone Stairs',
      'F': 'Fence',
      'O': 'Door Oak Bottom',
      'T': 'Oak Wood Stairs',
      'D': 'Double Stone Slab',
    },
    layout: [
      [' ',' ','F','F','F','F','F','F','F'],
      [' ',' ','F',' ',' ',' ',' ',' ','F'],
      [' ',' ','F',' ',' ',' ',' ',' ','F'],
      [' ',' ','F',' ',' ',' ',' ',' ','F'],
      [' ',' ','F',' ',' ',' ',' ',' ','F'],
      ['C','C','C','C','C','C','O','C','C'],
      ['C','P','T',' ',' ',' ',' ',' ','C'],
      ['C','T','F',' ',' ',' ',' ',' ','C'],
      ['C',' ',' ',' ',' ',' ','D',' ','C'],
      ['C',' ',' ',' ',' ',' ','D',' ','C'],
      ['C','C','O','C','C','C','C','C','C'],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'O': 'Door Oak Top',
      'G': 'Glass Pane',
      'W': 'Oak Wood',
      'L': 'Wooden Pressure Plate',
    },
    layout: [
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      ['C','P','G','G','P','P','O','P','C'],
      ['W',' ',' ',' ',' ',' ',' ',' ','W'],
      ['G',' ','L',' ',' ',' ',' ',' ','G'],
      ['G',' ',' ',' ',' ',' ',' ',' ','G'],
      ['W',' ',' ',' ',' ',' ',' ',' ','W'],
      ['C','P','O','P','P','G','P','P','C'],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'T': 'Oak Wood Stairs',
      '!': 'Torch',
    },
    layout: [
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      ['T','T','T','T','T','T','T','T','T'],
      ['C','P','P','P','P','P','P','P','C'],
      ['C',' ',' ',' ',' ',' ','!',' ','C'],
      ['C',' ',' ',' ',' ',' ',' ',' ','C'],
      ['C',' ',' ',' ',' ',' ',' ',' ','C'],
      ['C',' ','!',' ',' ',' ',' ',' ','C'],
      ['C','P','P','P','P','P','P','P','C'],
      ['T','T','T','T','T','T','T','T','T'],
    ],
  },
  {
    legend: {
      'P': 'Oak Wood Planks',
      'T': 'Oak Wood Stairs',
    },
    layout: [
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      ['T','T','T','T','T','T','T','T','T'],
      ['P','P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P'],
      ['T','T','T','T','T','T','T','T','T'],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    ],
  },
  {
    legend: {
      'T': 'Oak Wood Stairs',
    },
    layout: [
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      ['T','T','T','T','T','T','T','T','T'],
      ['T','T','T','T','T','T','T','T','T'],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    ],
  },
];

class ButcherShop {
  constructor() {
    this.layers = LAYERS;
  }
}

module.exports = ButcherShop;
