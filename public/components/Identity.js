import React from 'react';

import delaunayFast from 'delaunay-fast';
import colorbrewer from 'colorbrewer';

const {floor, random} = Math;

const SIZE = 512;
const MIN_POINTS = 5;
const MAX_POINTS = 10;

const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

const COLOR_GROUPS = Object.keys(colorbrewer).filter(k => !/^Set/.test(k));

export default class Identity extends React.Component {
  state = {
    url: ''
  };

  componentWillMount() {
    this.refreshUrl();
  }

  componentWillReceiveProps() {
    // XXX
  }

  refreshUrl() {
    const url = _makeUrl();
    this.setState({
      url
    });
  }

  getStyles() {
    const {size, special} = this.props;
    return {
      position: 'relative',
      width: size,
      height: size,
      border: '2px solid ' + (special ? DARK_COLOR : LIGHT_COLOR),
      boxSizing: 'border-box',
    };
  }

  getImageStyles() {
    const {url} = this.state;
    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: DARK_COLOR,
      backgroundImage: 'url(\'' + url + '\')',
      backgroundSize: 'cover',
      imageRendering: 'pixelated',
    };
  }

  render() {
    return <div style={this.props.style} onClick={() => {window.open(this.state.url, '_target');}}>
      <div style={this.getStyles()}>
        <div style={this.getImageStyles()} />
      </div>
    </div>;
  }
}

function _makeUrl() {
  const points = _makePoints();
  const normalizedPoints = _normalizePoints(points);
  const triangles = _triangulatePoints(points);

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  _drawDriangles(triangles, ctx);

  const url = canvas.toDataURL();
  return url;
}

function _randomSize() {
  return random() * SIZE;
}

function _randomPoint() {
  const x = _randomSize();
  const y = _randomSize();
  const point = [x, y];
  return point;
}

/* function _makePoints() {
  const result = [];
  const numPoints = MIN_POINTS + floor(random() * (MAX_POINTS - MIN_POINTS));
  for (let i = 0; i < numPoints; i++) {
    const point = _randomPoint();
    result.push(point);
  }
  return result;
} */

function _makePoints() {
  function _map(num, inRange, outRange ) {
    return ( num - inRange[0] ) * ( outRange[1] - outRange[0] ) / ( inRange[1] - inRange[0] ) + outRange[0];
  }

  const VARIANCE = 0.5;

  const width = SIZE;
  const height = SIZE;
  const numCells = 3;
  const cellSize = SIZE / numCells;
  const variance = cellSize * VARIANCE / 2;
  const bleedX = ((numCells * cellSize) - width)/2;
  const bleedY = ((numCells * cellSize) - height)/2;

  const points = [];
  for (let i = - bleedX; i < width + bleedX; i += cellSize) {
    for (let j = - bleedY; j < height + bleedY; j += cellSize) {
      const x = i + cellSize/2 + _map(random(), [0, 1], [-variance, variance]);
      const y = j + cellSize/2 + _map(random(), [0, 1], [-variance, variance]);
      points.push([x, y].map(floor));
    }
  }

  const numPoints = MIN_POINTS + floor(random() * (MAX_POINTS - MIN_POINTS));
  while (points.length > numPoints) {
    const index = floor(random() * points.length);
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

  (() => {
    let accX = 0;
    let accY = 0;

    for (let i = 0; i < avgPoints.length; i++) {
      const avgPoint = avgPoints[i];
      accX += avgPoint[0];
      accY += avgPoint[1];
    }

    const avgX = accX / avgPoints.length;
    const avgY = accY / avgPoints.length;

    console.log('avg x', avgX, avgY);
  })();

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

function _makeColors(n) {
  const result = [];
  while (result.length < n) {
    const numColorsNeeded = n - result.length;
    const colors = (() => {
      const colorGroup = colorbrewer[COLOR_GROUPS[floor(random() * COLOR_GROUPS.length)]];
      const colorGroupKeys = Object.keys(colorGroup);
      const firstColorGroupKey = parseInt(colorGroupKeys[0], 10);
      const lastColorGroupKey = parseInt(colorGroupKeys[colorGroupKeys.length - 1], 10);
      if (numColorsNeeded >= firstColorGroupKey && numColorsNeeded <= lastColorGroupKey) {
        console.log('choose inner');
        return colorGroup[numColorsNeeded];
      } else {
        console.log('choose all');
        return colorGroup[lastColorGroupKey];
      }
    })();
    const colorsSlice = colors.slice(0, numColorsNeeded);
    result.push.apply(result, colorsSlice);
  }
  return result;
}

function _drawDriangles(triangles, ctx) {
  function _makePoint(a) {
    return new Point(a[0], a[1]);
  }

  const colors = _makeColors(triangles.length);

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

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
