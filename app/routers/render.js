/**
 * 渲染页面
 */
module.exports = [
  ['GET', '/detail', 'render.RenderController', 'getDetailHtml'],
  ['GET', '/master-detail', 'render.RenderController', 'getMasterDetailHtml'],
  ['GET', '/master-detail2', 'render.RenderController', 'getMasterDetailHtml2'],
];
