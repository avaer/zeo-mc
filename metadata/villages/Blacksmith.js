"use strict";

const NAME = 'blacksmith';

const LAYERS = [
  {
    legend: {
      'C': 'Cobblestone',
      'S': 'Cobblestone Stairs',
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
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'W': 'Oak Wood',
      'L': 'Lava',
      'S': 'Oak Wood Stairs',
      'F': 'Fence',
      'D': 'Double Stone Slab',
      'Q': 'Chest',
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
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'N': 'Glass Pane',
      'I': 'Iron Bars',
      'W': 'Oak Wood',
      'F': 'Fence',
      'B': 'Furnace',
      'R': 'Wooden Pressure Plate',
    },
    layout: [
      ['C', 'C', 'C', 'C', 'P', 'N', 'P', 'N', 'P', 'W'],
      ['I', ' ', ' ', 'C', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['I', ' ', ' ', 'C', ' ', ' ', ' ', 'R', ' ', 'N'],
      [' ', ' ', ' ', 'B', 'P', 'P', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'N'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['F', ' ', ' ', ' ', 'F', ' ', 'W', 'P', 'P', 'W'],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'P': 'Oak Wood Planks',
      'W': 'Oak Wood',
      'F': 'Fence',
      'B': 'Furnace',
    },
    layout: [
      ['C', 'C', 'C', 'C', 'P', 'P', 'P', 'P', 'P', 'W'],
      ['C', 'C', 'C', 'C', ' ', ' ', ' ', ' ', ' ', 'P'],
      ['C', 'C', 'C', 'C', ' ', ' ', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', 'B', 'P', 'P', ' ', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'P'],
      [' ', ' ', ' ', ' ', ' ', ' ', 'P', ' ', ' ', 'P'],
      ['F', ' ', ' ', ' ', 'F', ' ', 'W', 'P', 'P', 'W'],
    ],
  },
  {
    legend: {
      'C': 'Cobblestone',
      'W': 'Oak Wood',
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
      '$': 'Stone Slab Top',
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
