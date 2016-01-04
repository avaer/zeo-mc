const url = require('url');

const config = require('../config/index.json');
const WorldReader = require('../lib/site-reader/index.js');

const worldReader = new WorldReader({
  dataDirectory: config.dataDirectory
});

const routes = [
  {
    path: '/worlds/:world',
    handler: function(req, res) {
      const world = req.param('world');

      worldReader.getIndexJson(world, u.ok(u.resErr(res), indexJson => {
        res.contentType(indexJson.contentType);
        res.send(indexJson.data);
	  }));
    }
  },
  {
    path: '/worlds/:world/:path*',
    handler: function(req, res) {
      const world = req.param('world');
      const path = req.param('path');

      worldReader.getFileStream({world, path}, u.ok(u.resErr(res), rs => {
        res.contentType(rs.contentType);
        rs.data.pipe(res);
	  }));
    }
  }
];

module.exports = routes;
