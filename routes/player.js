const url = require('url');

const config = require('../lib/config/index.js').get();
const PlayerReader = require('../lib/player-reader/index.js');

const playerReader = new PlayerReader({
  dataDirectory: config.dataDirectory
});

const routes = [
  {
    path: '/players/:player',
    handler: function(req, res) {
      const player = req.param('player');

      playerReader.getPlayerJson(player, u.ok(u.resErr(res), playerJson => {
        res.contentType(playerJson.contentType);
        res.send(playerJson.data);
	  }));
    }
  },
  {
    method: 'put',
    path: '/players/:player',
    handler: function(req, res) {
      const player = req.param('player');

      const name = player;
      const password = req.query.password || '';

      playerReader.createPlayer({
        name,
        password
      }, u.ok(u.resErr(res), playerJson => {
        res.contentType(playerJson.contentType);
        res.send(playerJson.data);
	  }));
    }
  },
  {
    method: 'post',
    path: '/players/:player',
    handler: function(req, res) {
      const player = req.param('player');

      const name = player;
      const password = req.query.password || '';

      playerReader.login({
        name,
        password
      }, u.ok(u.resErr(res), playerJson => {
        res.contentType(playerJson.contentType);
        res.send(playerJson.data);
	  }));
    }
  }
];

module.exports = routes;
