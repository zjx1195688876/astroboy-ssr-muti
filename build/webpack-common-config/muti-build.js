const webpack = require('webpack');
const webpackConfigMap = require('./webpack.muti.config');

const CONFIG_ARR = [];
for (let page in webpackConfigMap) {
  CONFIG_ARR.push(webpackConfigMap[page].clientConfig);
  CONFIG_ARR.push(webpackConfigMap[page].serverConfig);
}

const isProd = process.env.NODE_ENV === 'prod';
let compiler;

if (isProd) {
  compiler = webpack(CONFIG_ARR, (err, stats) => {
    // 在这里打印 watch/build 结果...
    process.stdout.write(stats.toString({
      chunks: false,  // 使构建过程更静默无输出
      colors: true    // 在控制台展示颜色
    }) + "\n");
  });
} else {
  compiler = webpack(CONFIG_ARR);
  const watching = compiler.watch({
    // watchOptions 示例
    aggregateTimeout: 300,
    poll: undefined
  }, (err, stats) => {
    // 在这里打印 watch/build 结果...
    process.stdout.write(stats.toString({
      chunks: false,  // 使构建过程更静默无输出
      colors: true    // 在控制台展示颜色
    }) + "\n");
  });
}