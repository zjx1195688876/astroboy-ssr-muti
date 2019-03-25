// 为context挂载ssr render方法，这个可以抽离为单独的plugin
const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');
const LRU = require('lru-cache');

const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign({}, options, {
    runInNewContext: false
  }));
};

class Engine {
  constructor(app) {
    this.app = app;
    this.config = this.app.config;
  }

  renderer(name) {
    const { ROOT_PATH } = this.app;
    // 生产环境直接获取
    // 优化空间
    // 服务启动之后，fs读取所有server-bundle.json和client-manifest.json，然后维护一个cache的列表，不用每次读取json文件
    // 尝试了下缓存，结果没区别

    const SSR_CONFIG = this.config['ssr-plugin']; // 来自config.default.js
    const { bundlePath, templatePath, clientManifestPath } = SSR_CONFIG;
    
    try {
      const bundle = require(`${bundlePath}/${name}/vue-ssr-server-bundle.json`);
      const clientManifest = require(`${clientManifestPath}/${name}/vue-ssr-client-manifest.json`);

      let template = '';
      if (!template) {
        template = fs.readFileSync(templatePath, 'utf-8');
      }
      this.createRenderer = createRenderer(bundle, {
        template,
        clientManifest,
        cache: LRU({
          max: 1000,
          maxAge: 1000 * 60 * 15
        })
      });
      return this.createRenderer;
    } catch (error) {
      return 'render error';
    }
  }

  renderData(name, url) {
    const context = {
      url
    };
    return new Promise( (resolve, reject) => {
      this.renderer(name).renderToString(context, (err, html) => {
        if (err) {
          return reject(err);
        }
        resolve(html);
      });
    })
  }
}

module.exports = Engine;