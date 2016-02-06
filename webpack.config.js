var path = require('path');

var webpack = require('webpack');
var glob = require('glob');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://HOSTNAME:PORT',
    'webpack/hot/only-dev-server'
  ].concat(glob.sync('./public/include/*/index.js')).concat([
    './public/index'
  ]),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /^\.\/public\/(?:include|dist)\/[^\/]+\/index.js$/,
        loaders: ['react-hot', 'babel'],
        include: [
          path.join(__dirname, 'public/index'),
          path.join(__dirname, 'public/lib'),
          path.join(__dirname, 'public/constants'),
          path.join(__dirname, 'public/utils'),
          path.join(__dirname, 'public/resources'),
          path.join(__dirname, 'public/components'),
          path.join(__dirname, 'public/stores'),
          path.join(__dirname, 'public/engines'),
          path.join(__dirname, 'public/records')
        ]
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
      },
    ]
  }
};
