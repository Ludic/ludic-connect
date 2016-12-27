/*
 * ludic-connect dev config
 */

var path = require('path');
var fs = require('fs');

module.exports = {
  entry: "./src/main.js",
  output: {
    libraryTarget: 'commonjs2',
    path: __dirname + '/dist',
    filename: "main.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["es2015",{modules: false}],
            "stage-1",
          ]
        },
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
    },
    extensions: ['.js', '.scss', '.json'],
  },
  devtool: '#source-map',
  performance: {
    hints: false, // disable warning about size of bundle
  },
};