const path = require('path');
const url = require('url');

const st = require('st');

const stImg = st({
  path: path.join(__dirname, '..', 'public', 'img'),
  url: '/img'
});
stImg.url = '/img/:path*';

const stMounts = [stImg];

const routes = stMounts.map(stMount => ({
  path: stMount.url,
  handler: (req, res, next) => {
    const stHandled = stMount(req, res);
    if (!stHandled) {
      next();
    }
  }
}));

module.exports = routes;
