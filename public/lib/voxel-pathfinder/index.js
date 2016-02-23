"use strict";

const PF = require('../path3d/index');

const SIZE = 32;

const DIRECTIONS = (() => {
  const result = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const numNonZeroes = +(x !== 0) + +(y !== 0) + +(z !== 0);
        if (numNonZeroes === 1) {
          result.push([x, y, z]);
        }
      }
    }
  }
  return result;
})();

function _getIndex(x, y, z) {
  return x + y * SIZE + z * SIZE * SIZE;
}

function _yes() {
  return true;
}

function _makeNodes(size, walkable) {
  const nodes = Array(size * size * size);
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value = walkable(x, y, z);
        const node = new Node(x, y, z, value);
        nodes[_getIndex(x, y, z)] = node;
      }
    }
  }
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const node = nodes[_getIndex(x, y, z)];

        for (let i = 0; i < DIRECTIONS.length; i++) {
          const direction = DIRECTIONS[i];
          const neighborPosition = [x + direction[0], y + direction[1], z + direction[2]];
          if (
            neighborPosition[0] >= 0 && neighborPosition[0] < size &&
            neighborPosition[1] >= 0 && neighborPosition[1] < size && 
            neighborPosition[2] >= 0 && neighborPosition[2] < size
          ) {
            const neighbor = nodes[_getIndex(neighborPosition[0], neighborPosition[1], neighborPosition[2])];
            if (neighbor.value) {
              node.neighbors.push(neighbor);
            }
          }
        }
      }
    }
  }
  return nodes;
}

class Node {
  constructor(x, y, z, value) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.value = value;

    this.neighbors = [];
  }
}

class Grid {
  constructor(opts) {
    opts = opts || {};

    const size = opts.size || SIZE;
    const walkable = opts.walkable || _yes;

    this._nodes = _makeNodes(size, walkable);
  }

  getPath(start, end) {
    const startNode = this._nodes[_getIndex(start[0], start[1], start[2])];
    const endNode = this._nodes[_getIndex(end[0], end[1], end[2])];

    const finder = new PF.AStarFinder();
    const path = finder.findPath(startNode, endNode, this._nodes);
    return path;
  }
}

// node -e 'Grid = require("./index.js"); console.log(Grid.test());'
Grid.test = () => {
  function _randomCoord() {
    return Math.floor(Math.random() * SIZE);
  }

  const grid = new Grid({
    size: SIZE,
    walkable: (x, y, z) => Math.random() < 0.5
  });
  const start = [_randomCoord(), _randomCoord(), _randomCoord()];
  const end = [_randomCoord(), _randomCoord(), _randomCoord()];
  const path = grid.getPath(start, end);
  return path;
};

module.exports = Grid;
