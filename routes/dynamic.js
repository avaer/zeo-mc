const path = require('path');
const url = require('url');

const avatarGenerator = require('avatar-generator');
const avatarGeneratorInstance = avatarGenerator();
const polygen = require('polygen');

const SIZE = 16;
const MIN_POINTS = 5;
const MAX_POINTS = 10;
const NUM_CELLS = 3;
const VARIANCE = 0.25;
const DEFAULT_SEED = 'world';

const routes = [
  {
    path: '/img/users/:gender/:path*',
    handler: (req, res, next) => {
      console.log('user image', req.params);
      res.type('image/png');
      avatarGeneratorInstance(req.params.path, req.params.gender, SIZE).stream().pipe(res);
    }
  },
  {
    path: '/img/worlds/:path*',
    handler: (req, res, next) => {
      res.type('image/png');
      polygen({
        size: SIZE,
        minPoints: MIN_POINTS,
        maxPoints: MAX_POINTS,
        numCells: NUM_CELLS,
        variance: VARIANCE,
        seed: req.params.path,
      }).stream().pipe(res);
    }
  }
];

module.exports = routes;
