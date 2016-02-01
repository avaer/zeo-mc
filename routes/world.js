const url = require('url');

const Worlds = require('../lib/worlds');

const routes = [
  {
    path: '/worlds/:world',
    handler: function(req, res, next) {
      const world = req.param('world');

      res.promise(db.getWorld(world));
    }
  },
  {
    method: 'put',
    path: '/worlds/:world',
    handler: function(req, res, next) {
      const world = req.param('world');

      res.promise(db.setWorld(world));
    }
  }
];

module.exports = routes;
