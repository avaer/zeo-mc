(function() {
"use strict";

const Alea = require('alea');
const delaunayFast = require('delaunay-fast');
const colorbrewer = require('colorbrewer');

const {floor} = Math;

const SIZE = 128;
const MIN_POINTS = 5;
const MAX_POINTS = 10;
const NUM_CELLS = 3;
const VARIANCE = 0.25;
const DEFAULT_SEED = 'shoo';

const COLOR_GROUPS = Object.keys(colorbrewer).filter(k => !/^Set/.test(k));

function Polygen(opts) {
  opts = opts || {};
  opts.size = opts.size || SIZE;
  opts.minPoints = opts.minPoints || MIN_POINTS;
  opts.maxPoints = opts.maxPoints || MAX_POINTS;
  opts.numCells = opts.numCells || NUM_CELLS;
  opts.variance = opts.variance || VARIANCE;
  opts.seed = opts.seed || DEFAULT_SEED;

  this._size = opts.size;
  this._minPoints = opts.minPoints;
  this._maxPoints = opts.maxPoints;
  this._numCells = opts.numCells;
  this._variance = opts.variance;
  this._seed = opts.seed;

  this._canvas = this.make();
}
Polygen.prototype = {
  make: function() {
    const rng = new Alea(this._seed);

    const points = _makePoints(this._size, this._numCells, this._variance, rng);
    const normalizedPoints = _normalizePoints(points);
    const triangles = _triangulatePoints(points);

    const canvas = _makeCanvas({
      width: this._size,
      height: this._size,
    });
    const ctx = canvas.getContext('2d');

    _drawDriangles(triangles, ctx, rng);

    return canvas;
  },
  stream: function() {
    return this._canvas.pngStream();
  },
  dataUrl: function() {
    return this._canvas.toDataURL();
  }
};

function polygen(opts) {
  return new Polygen(opts);
}

module.exports = polygen;

const _makeCanvas = (() => {
  if (typeof document !== 'undefined') {
    return opts => {
      const canvas = document.createElement('canvas');
      canvas.width = opts.width;
      canvas.height = opts.height;
      return canvas;
    };
  } else {
    const Canvas = global['require']('canvas');
    return opts => {
      const canvas = new Canvas(opts.width, opts.height);
      return canvas;
    };
  }
})();

function _makePoints(size, numCells, variance, rng) {
  function _map(num, inRange, outRange ) {
    return ( num - inRange[0] ) * ( outRange[1] - outRange[0] ) / ( inRange[1] - inRange[0] ) + outRange[0];
  }

  const width = size;
  const height = size;
  const cellSize = SIZE / numCells;
  const varianceFactor = cellSize * variance;
  const bleedX = ((numCells * cellSize) - width)/2;
  const bleedY = ((numCells * cellSize) - height)/2;

  const points = [];
  for (let i = - bleedX; i < width + bleedX; i += cellSize) {
    for (let j = - bleedY; j < height + bleedY; j += cellSize) {
      const x = i + cellSize/2 + _map(rng(), [0, 1], [-varianceFactor, varianceFactor]);
      const y = j + cellSize/2 + _map(rng(), [0, 1], [-varianceFactor, varianceFactor]);
      points.push([x, y].map(floor));
    }
  }

  const numPoints = MIN_POINTS + floor(rng() * (MAX_POINTS - MIN_POINTS));
  while (points.length > numPoints) {
    const index = floor(rng() * points.length);
    points.splice(index, 1);
  }

  return points;
}


function _normalizePoints(points) {
  let accX = 0;
  let accY = 0;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    accX += point[0];
    accY += point[1];
  }

  const avgX = accX / points.length;
  const avgY = accY / points.length;

  function _normalizeValue(v, avg) {
    return v - (avg - (SIZE / 2));
  }

  const avgPoints = points.map(point => {
    return [
      _normalizeValue(point[0], avgX),
      _normalizeValue(point[1], avgY)
    ];
  });

  return avgPoints;
}

function _triangulatePoints(points) {
  const triangleVertexIndexes = delaunayFast.triangulate(points);
  const triangles = (() => {
    const numTriangles = triangleVertexIndexes.length / 3;
    const result = Array(numTriangles);
    for (let i = 0; i < numTriangles; i++) {
      result[i] = triangleVertexIndexes.slice(i * 3, (i + 1) * 3).map(j => points[j]);
    }
    return result;
  })();
  return triangles;
}

function _makeColors(n, rng) {
  const result = [];
  while (result.length < n) {
    const numColorsNeeded = n - result.length;
    const colors = (() => {
      const colorGroup = colorbrewer[COLOR_GROUPS[floor(rng() * COLOR_GROUPS.length)]];
      const colorGroupKeys = Object.keys(colorGroup);
      const firstColorGroupKey = parseInt(colorGroupKeys[0], 10);
      const lastColorGroupKey = parseInt(colorGroupKeys[colorGroupKeys.length - 1], 10);
      if (numColorsNeeded >= firstColorGroupKey && numColorsNeeded <= lastColorGroupKey) {
        return colorGroup[numColorsNeeded];
      } else {
        return colorGroup[lastColorGroupKey];
      }
    })();
    const colorsSlice = colors.slice(0, numColorsNeeded);
    result.push.apply(result, colorsSlice);
  }
  return result;
}

function _drawDriangles(triangles, ctx, rng) {
  function _makePoint(a) {
    return new Point(a[0], a[1]);
  }

  const colors = _makeColors(triangles.length, rng);

  for (let i = 0; i < triangles.length; i++) {
    const triangle = triangles[i];
    const color = colors[i];
    const p1 = _makePoint(triangle[0]);
    const p2 = _makePoint(triangle[1]);
    const p3 = _makePoint(triangle[2]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    // ctx.lineTo(p1.x, p1.y);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

})();
