const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const baseConfig = require('./webpack.base.config.js');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const { ROOT_PATH, PAGE_ROUTER } = require('./utils');


module.exports = merge(baseConfig, {
  target: 'node',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  })
})