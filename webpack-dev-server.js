var config = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

config.entry = [
  "webpack/hot/dev-server",
  "webpack-dev-server/client?http://dockerhost:3001"
].concat(config.entry);

config.plugins = [
  new webpack.HotModuleReplacementPlugin()
].concat(config.plugins);

var server = new WebpackDevServer(webpack(config), {
  publicPath: "http://dockerhost:3001/",
  stats: {
    colors: true
  },
  hot: true
});

server.listen(3001);
