// 降级为客户端渲染，服务端渲染的时候其实用不到这个文件
import Vue from 'vue';
import App from './index.vue';
import { createStore } from '@client/store';

const store = createStore();

new Vue({
  el: '#degrade-app', // 降级为客户端渲染的容器
  store,
  render: h => h(App)
});
