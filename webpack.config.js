var path = require('path');

module.exports = {
  entry: './client/app/client.js',
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'client/dist')
  }
};