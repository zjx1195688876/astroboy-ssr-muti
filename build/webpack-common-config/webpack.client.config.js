const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('../webpack.config');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const { ROOT_PATH, PAGE_ROUTER} = require('./utils');



const plugins = () => {
  let pluginsArr = [];
  for (let pageName in PAGE_ROUTER) {
    let plugin =  new VueSSRClientPlugin({
      filename: `server/${pageName}/vue-ssr-client-manifest.json`
    })
    pluginsArr.push(plugin);
  }
  return pluginsArr;
};

module.exports = merge(baseConfig, {
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: "all",
      minSize: 3000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        //vue相关框架
        main:{
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          priority: -9,
          name: 'main'
        },
        //除Vue之外其他框架
        vendors: {
          test: /[\\/]node_modules[\\/]?!(vue)[\\/]/,
          priority: -10,
          name: "vendors"
        },
        //业务中可复用的js
        common: {
          test: /[\\/]common[\\/].+\.js$/,
          priority: -11,
          name: "common"
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})