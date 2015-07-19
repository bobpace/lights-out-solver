var path = require('path');
var stub = path.join(__dirname, "stub.js");

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
      fs: stub,
      lapack: stub
    }
  }
};
