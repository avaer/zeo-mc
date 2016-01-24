const url = require('url');

const config = require('../lib/config/index.js').get();
const PlayerReader = require('../lib/player-reader/index.js');

const playerReader = new PlayerReader({
  dataDirectory: config.dataDirectory
});

const routes = [
  {
    path: '/players/:player',
    handler: function(req, res, next) {
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
    handler: function(req, res, next) {
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
    handler: function(req, res, next) {
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
  },
  {
    path: '/players/:player/inventory',
    handler: [ authCookie, function(req, res, next) {
      const player = req.param('player');

      const name = player;

      playerReader.getPlayerLocalInventoryJson({
        name
      }, u.ok(u.resErr(res), inventoryJson => {
        res.contentType(inventoryJson.contentType);
        res.send(inventoryJson.data);
      }));
    } ]
  },
  {
    method: 'put',
    path: '/players/:player/inventory',
    handler: [ authCookie, readJson, function(req, res, next) {
      const player = req.param('player');
      const item = req.param('item');
      const inventory = req.json;

      const name = player;

      playerReader.setPlayerLocalInventoryJson({
        name,
        inventory
      }, u.resErr(res));
    } ]
  },
  {
    path: '/players/:player/data/:item',
    handler: [ authCookie, function(req, res, next) {
      const player = req.param('player');
      const item = req.param('item');

      const name = player;

      playerReader.getPlayerReadDataStream({
        name,
        item
      }, u.ok(u.resErr(res), rs => {
        res.contentType(rs.contentType);
        rs.data.pipe(res);
      }));
    } ]
  },
  {
    method: 'put',
    path: '/players/:player/data/:item',
    handler: [ authCookie, function(req, res, next) {
      const player = req.param('player');
      const item = req.param('item');

      const name = player;

      playerReader.getPlayerWriteDataStream({
        name,
        item
      }, u.ok(u.resErr(res), ws => {
        req.pipe(ws);

        ws.on('finish', () => {
          res.send();
        });
      }));
    } ]
  }
];

function authCookie(res, res, next) {
  const player = req.param('player');
  const cookie = req.header('cookie');

  const name = player;

  playerReader.getPlayerJsonByCookie({
    name,
    cookie
  }, u.ok(cb, playerJson => {
    req.player = playerJson.data;

    next();
  }));
}

function readJson(req, res, next) {
  const bs = [];

  req.on('data', b => {
    bs.push(b);
  });

  req.on('end', () => {
    const d = Buffer.concat(bs);
    const s = d.toString('utf8');
    const json = u.jsonParse(s);

    req.json = json;

    next();
  });
}

module.exports = routes;
