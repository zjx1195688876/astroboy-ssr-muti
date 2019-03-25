/**
 * 扩展 Koa Context 对象
 */
const path = require('path');
const fs = require('fs');

// 降级为客户端渲染
const renderClient = (name, _this) => {
  const SSR_CONFIG = _this.app.config['ssr-plugin']; // 来自config.default.js
  const { degradePath = '' } = SSR_CONFIG;
  // 测试同步读取和异步读取的qps区别
  let template = fs.readFileSync(`${degradePath}/pages/${name}.html`, 'utf-8');

  return template;
};
// 服务端渲染
const render = async (name, _this) => {
  let html = '';
  const renderer = _this.app.ssr.renderer(name);
  const { url = '/' } = _this.req
  while(renderer) {
    try {
      html = await _this.app.ssr.renderData(name, url, renderer);
    } catch (e) { // 单个流量服务端渲染失败，降级为客户端渲染
      html = renderClient(name, _this);
    }
    return html;
  }
};

module.exports = {
  async renderSSR(name) {
    console.log('app.isSSR: ', this.app.isSSR);
    if (this.app.isSSR === false) {
      return await renderClient(name, this);
    } else {
      return await render(name, this);
    }
  }
};
