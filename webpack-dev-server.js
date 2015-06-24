var config = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var R = require('ramda');

var port = 3000;
var webDevServerAddress = "http://dockerhost:" + port;

config.entry = [
  "webpack/hot/dev-server",
  "webpack-dev-server/client?" + webDevServerAddress
].concat(config.entry);

config.plugins = [
  new webpack.HotModuleReplacementPlugin()
].concat(config.plugins);

var enableReactHotLoader = R.map(
  R.ifElse(
    R.pipe(R.prop('test'), R.test(/jsx/)),
    R.converge(
      R.assoc('loader'),
      R.pipe(R.prop('loader'), R.concat('react-hot!')),
      R.identity
    ),
    R.identity
  )
);

config.module.loaders = enableReactHotLoader(config.module.loaders);

var server = new WebpackDevServer(webpack(config), {
  publicPath: webDevServerAddress + "/",
  stats: {
    colors: true
  },
  hot: true
});

server.listen(port);
