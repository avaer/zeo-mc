const path = require('path');
const url = require('url');

// const mime = require('mime');
const avatarGenerator = require('avatar-generator');
const avatarGeneratorInstance = avatarGenerator();
const retricon = require('retricon-without-canvas');

const SIZE = 16;

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
      retricon(req.params.path, {pixelSize: 1}).pngStream().pipe(res);
    }
  }
];

module.exports = routes;
