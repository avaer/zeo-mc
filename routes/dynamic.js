const path = require('path');
const url = require('url');

const avatarGenerator = require('avatar-generator');
const avatarGeneratorInstance = avatarGenerator();
const polygen = require('polygen');

const USER_SIZE = 16;

const WORLD_SIZE = 32;
const MIN_POINTS = 5;
const MAX_POINTS = 10;
const NUM_CELLS = 3;
const VARIANCE = 0.25;
const DEFAULT_SEED = 'world';

const routes = [
  {
    path: '/img/users/:gender/:path*',
    handler: (req, res, next) => {
      if (req.params.path && req.params.gender) {
        res.type('image/png');
        avatarGeneratorInstance(req.params.path, req.params.gender, USER_SIZE).stream().pipe(res);
      } else {
        res.sendStatus(400);
      }
    }
  },
  {
    path: '/img/worlds/:path*',
    handler: (req, res, next) => {
      if (req.params.path) {
        res.type('image/png');
        polygen({
          size: WORLD_SIZE,
          minPoints: MIN_POINTS,
          maxPoints: MAX_POINTS,
          numCells: NUM_CELLS,
          variance: VARIANCE,
          seed: req.params.path,
        }).stream().pipe(res);
      } else {
        res.sendStatus(400);
      }
    }
  }
];

module.exports = routes;
