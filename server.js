const path = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const config = require('./lib/config');
const u = require('./lib/js-utils');
const routes = require('./routes/index.js');
const streams = require('./streams/index.js');

const API_PREFIX = '/api';

config.bootstrap(u.ok(() => {
  const c = config.get();

  const boundWebpackConfig = (() => {
    const result = u.shallow(webpackConfig);
    result.entry = result.entry.map(entry => entry.replace(/HOSTNAME/, c.hostname).replace(/PORT/, c.port));
    return result;
  })();

  const webpackDevServer = new WebpackDevServer(webpack(boundWebpackConfig), {
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

  const streamApp = streams.app({
    prefix: path.join(API_PREFIX, '/stream')
  });
  streamApp.attach(webpackDevServer.listeningApp);

  const routesApp = routes.app();
  webpackDevServer.use(API_PREFIX, routesApp);

  webpackDevServer.listen(c.port, null, function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at :' + c.port);
  });
}));
