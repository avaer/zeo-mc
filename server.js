const path = require('path');

const express = require('express');
const spdy = require('spdy');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const config = require('./lib/config');
const u = require('./lib/js-utils');
const routes = require('./routes/index.js');
const streams = require('./streams/index.js');

u.parallel(cb => {
  config.bootstrap(cb);
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

  const webpackDevServerApp = webpackDevServer.app;

  const app = express();
  webpackDevServer.listeningApp = spdy.createServer({
    cert: c.cert,
    key: c.privateKey,
  }, app);
  const streamPrefix = path.join(c.apiPrefix, '/stream');
  const streamApp = streams.app({
    prefix: streamPrefix
  });
  streamApp(webpackDevServer.listeningApp);
  const routesApp = routes.app();
  app.use(c.apiPrefix, routesApp);
  app.all('*', (req, res, next) => {
    webpackDevServerApp(req, res, next);
  });

  webpackDevServer.listen(c.port, null, function (err, result) {
    if (!err) {
      console.log('Listening at :' + c.port);
    } else {
      console.log(err);
    }
  });
}));
