import Vue from 'vue';
import App from './index.vue';
import { createStore } from '@client/store';

const store = createStore();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

const app = new Vue({
  store,
  render: h => h(App)
});

app.$mount('#app');
