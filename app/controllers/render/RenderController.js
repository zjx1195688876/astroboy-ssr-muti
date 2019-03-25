// const path = require('path');
// const fs = require('fs');
const H5BaseController = require('@youzan/iron-base/app/controllers/base/H5BaseController');

class RenderController extends H5BaseController {
  async getMasterDetailHtml(ctx) {
    const html = await ctx.renderSSR('master-detail');
    ctx.body = html;
  }

  async getMasterDetailHtml2(ctx) {
    const html = await ctx.renderSSR('master-detail2');
    ctx.body = html;
  }

  async getDetailHtml(ctx) {
    const html = await ctx.renderSSR('detail');
    ctx.body = html;
  }
}

module.exports = RenderController;
