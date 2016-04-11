"use strict";

const path = require('path');
const url = require('url');

const avatarGenerator = require('avatar-generator');
const avatarGeneratorInstance = avatarGenerator();
const polygen = require('polygen');
const staticAtlaspackGenerator = require('../lib/static-atlaspack/generator');

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
  },
  {
    path: '/img/textures/atlas.json',
    handler: (req, res, next) => {
      _getAtlas((err, atlas) => {
        if (!err) {
          res.type('application/json');
          res.send(atlas.json);
        } else {
          res.sendStatus(500);
        }
      });
    }
  },
  {
    path: '/img/textures/atlas.png',
    handler: (req, res, next) => {
      _getAtlas((err, atlas) => {
        if (!err) {
          res.type('image/png');
          res.send(atlas.img);
        } else {
          res.sendStatus(500);
        }
      });
    }
  },
];

const _getAtlas = (() => {
  let _atlas = null;
  let _error = null;
  let _loaded = false;
  let _queue = [];

  const _respondQueue = () => {
    for (let i = 0; i < _queue.length; i++) {
      const cb = _queue[i];
      _respond(cb);
    }
    _queue = [];
  };
  const _respond = cb => {
    if (!_error) {
      cb(null, _atlas);
    } else {
      cb(_error);
    }
  };

  process.nextTick(() => {
    staticAtlaspackGenerator((err, atlas) => {
      if (!err) {
        _atlas = atlas;
      } else {
        _error = err;
      }
      _loaded = true;

      _respondQueue();
    });
  });

  return cb => {
    if (_loaded) {
      process.nextTick(() => {
        _respond(cb);
      });
    } else {
      _queue.push(cb);
    }
  };
})();

module.exports = routes;
