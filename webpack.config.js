module.exports = {
  entry: ["./entry.jsx"],
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: "style!css"},
      {test: /\.jsx?$/, exclude: /node_modules/, loader: "babel"}
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
