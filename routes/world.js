const url = require('url');

const db = require('../lib/db/index.js');

const routes = [
  {
    path: '/worlds/:world',
    handler: function(req, res, next) {
      const world = req.param('world');

      res.send(db.getWorld(world));
    }
  },
  {
    method: 'put',
    path: '/worlds/:world',
    handler: function(req, res, next) {
      const world = req.param('world');

      res.send(db.setWorld(world));
    }
  }
];

module.exports = routes;
