const fs = require('fs');
const path = require('path');
const ROOT_PATH = process.cwd();
const config = require('../../webpack.config');

const PAGES_PATH = config.pages ? config.pages : path.join(ROOT_PATH, '/client/pages');
let PAGE_ROUTER = {};

const getPageRouter = () => {
  // 寻找多页的入口，只支持两级
  const pages = fs.readdirSync(PAGES_PATH);
  pages.map(page => {
    if (/\.vue/.test(page)) {
      console.error('页面文件目录不规范');
    } else {
      const childPages = fs.readdirSync(path.join(PAGES_PATH, `${page}`));
      const len = childPages.length;
      let hasIndex = false;
      let hasEntryClient = false;
      let hasEntryServer = false;
      for (let i = 0; i < len; i++) {
        if (/(index|app|App).vue/.test(childPages[i])) {
          hasIndex = true;
          break;
        }
      }
      for (let i = 0; i < len; i++) {
        if (/(entry-client).js/.test(childPages[i])) {
          hasEntryClient = true;
          break;
        }
      }
      for (let i = 0; i < len; i++) {
        if (/(entry-server).js/.test(childPages[i])) {
          hasEntryServer = true;
          break;
        }
      }
      if (hasIndex && hasEntryClient && hasEntryServer) {
        let router = {};
        router[page] = {
          dir: path.join(PAGES_PATH, `${page}`),
        };
        PAGE_ROUTER = Object.assign({}, PAGE_ROUTER, router);
      }
    }
  });

  return PAGE_ROUTER;
};

module.exports = getPageRouter();