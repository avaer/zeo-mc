const path = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const config = require('./lib/config');
const worlds = require('./lib/worlds-instance');
const u = require('./lib/js-utils');
const routes = require('./routes/index.js');
const streams = require('./streams/index.js');

const API_PREFIX = '/api';

u.parallel(cb => {
  config.bootstrap(cb);
}, cb => {
  worlds.onready(cb);
}, u.ok(() => {
  const c = config.get();

  const boundWebpackConfig = (() => {
    const result = u.shallow(webpackConfig);
    const entry = result.entry;
    for (var k in entry) {
      entry[k] = entry[k].map(subentry => subentry.replace(/HOSTNAME/, c.hostname).replace(/PORT/, c.port));
    }
    return result;
  })();

  const wp = webpack(boundWebpackConfig);
  const webpackDevServer = new WebpackDevServer(wp, {
    publicPath: boundWebpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  });
  webpackDevServer.use(function(req, res, next) {
    res.promise = function(p) {
      p.then(function(result) {
        res.json(result);
      }).catch(function(err) {
        res.statusCode = 500;
        res.send(err);
      });
    };

    next();
  });

  const streamPrefix = path.join(API_PREFIX, '/stream');
  const streamApp = streams.app({
    prefix: streamPrefix
  });
  streamApp.attach(webpackDevServer.listeningApp, {
    path: streamPrefix
  });

  const routesApp = routes.app();
  webpackDevServer.use(API_PREFIX, routesApp);

  webpackDevServer.listen(c.port, null, function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at :' + c.port);
  });
}));
