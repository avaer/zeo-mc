const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const config = require('config');
const u = require('./lib/js-utils/index.js');
const routes = require('./routes/index.js');

config.bootstrap(u.ok(() => {
  const server = new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  });

  const routesApp = routes.app();
  server.use('/kazmer', routesApp);

  server.listen(3000, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at localhost:3000');
  });
}));
