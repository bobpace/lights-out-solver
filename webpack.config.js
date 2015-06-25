var path = require('path');
module.exports = {
  entry: ["./entry.jsx"],
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.less$/, loader: "style!css!less"},
      {test: /\.jsx?$/, exclude: /node_modules/, loader: "babel"}
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      fs: path.join(__dirname, "/stub-fs.js")
    }
  }
};
