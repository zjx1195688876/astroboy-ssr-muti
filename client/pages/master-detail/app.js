// 通用entry (universal entry)
import Vue from 'vue';
import App from './index.vue';
import { createStore } from '@client/store';;

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  // 创建 store 实例
  const store = createStore();

  const app = new Vue({
    store,
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  });

  return {
    app,
    store
  };
};
