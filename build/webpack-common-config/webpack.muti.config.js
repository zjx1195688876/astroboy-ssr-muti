const path = require('path');
const { PAGE_ROUTER, ROOT_PATH } = require('./utils');
const merge = require('webpack-merge');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const webpackConfig = require('../webpack.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const isProd = process.env.NODE_ENV === 'prod';

let webpackConfigMap = {};
for (let pageName in PAGE_ROUTER) {
  let config = PAGE_ROUTER[pageName];
  let cConfig = merge({}, clientConfig, {
    entry: {
      [pageName]: `${config.dir}/entry-client.js`        //buildEntryFiles生成的配置文件
    },
    output: {
      path: webpackConfig.static ? webpackConfig.static : path.join(ROOT_PATH, '/static/build/'),
      filename: isProd ? `js/${pageName}/[name].[chunkhash:8].js` : `js/${pageName}/[name].js` //static对应的目录
    },
    plugins: [
      new VueSSRClientPlugin({
        filename: `server/${pageName}/vue-ssr-client-manifest.json`//static对应的目录
      })
    ]
  });
  let sConfig = merge({}, serverConfig, {
    entry: {
      [pageName]: `${config.dir}/entry-server.js`        //buildEntryFiles生成的配置文件
    },
    output: {
      path: webpackConfig.static ? webpackConfig.static : path.join(ROOT_PATH, '/static/build/'),
    },
    plugins: [
      new VueSSRServerPlugin({
        filename: `server/${pageName}/vue-ssr-server-bundle.json`       //static对应的目录
      })
    ]
  });
  webpackConfigMap[pageName] = {clientConfig: cConfig, serverConfig: sConfig};
}

module.exports = webpackConfigMap;
