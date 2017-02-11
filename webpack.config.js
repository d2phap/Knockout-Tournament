var path = require('path');
var webpack = require('webpack');

module.exports = {
  // context: __dirname + './client/app',
  entry: './client/app/client.js',
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'client/dist')
  }
};