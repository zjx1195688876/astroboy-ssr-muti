const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config.js');
const config = require('../webpack.config');
const { ROOT_PATH } = require('./utils');

const STATIC_PATH = config.static ? config.static : path.join(ROOT_PATH, '/static/build');
const VIEW_PATH = config.views ? config.views : path.join(ROOT_PATH, '/app/views');
const PAGES_PATH = config.pages ? config.pages : path.join(ROOT_PATH, '/client/pages');

const isProd = process.env.NODE_ENV === 'prod';

const getEntryList = () => {
  // 寻找多页的入口，只支持两级
  const pages = fs.readdirSync(PAGES_PATH);
  let entryPathObj = {};
  let filenameArr = [];
  pages.map(page => {
    if (/\.vue/.test(page)) {
      console.error('页面文件目录不规范');
    } else {
      const childPages = fs.readdirSync(path.join(PAGES_PATH, `${page}`));
      childPages.map(childPage => {
        if (/(index|app|App).vue/.test(childPage)) {
          let obj = {};
          obj[page] = `${PAGES_PATH}/${page}/main.js`;
          entryPathObj = Object.assign({}, entryPathObj, obj); // webpack entry object
          filenameArr.push({ filename: page });
        }
      });
    }
  });
  return {
    entryPathObj,
    filenameArr
  };
};

const createPluginInstance = (list = []) => (
  list.map((item) => {
    return new HtmlWebpackPlugin({
      filename: item.filename ? `${STATIC_PATH}/degrade/pages/${item.filename}.html` : `${STATIC_PATH}/degrade/pages/${item}.html`, // 降级的html静态文件
      template: `${VIEW_PATH}/index.html`,
      title: '\u200E',
      chunks: [
        'main',
        `${item.filename ? item.filename : item}`
      ]
    });
  })
);

const { entryPathObj, filenameArr} = getEntryList();

console.log('entryPathObj: ', entryPathObj);

module.exports = merge(baseConfig, {
  entry: entryPathObj,
  output: {
    path: config.static ? path.join(config.static, '/degrade/js/') : path.join(ROOT_PATH, '/static/build/degrade/js/'),
    publicPath: '/degrade/js/',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js'
  },
  plugins: createPluginInstance(filenameArr)
});
