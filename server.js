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
  const server = new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  });

  const streamApp = streams.app({
    prefix: path.join(API_PREFIX, '/stream')
  });
  streamApp.attach(server);

  const routesApp = routes.app();
  server.use(API_PREFIX, routesApp);

  server.listen(3000, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at localhost:3000');
  });
}));
