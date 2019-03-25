import Vue from 'vue';
import App from './index.vue';
import { createStore } from '@client/store';


export default context => {
  return new Promise((resolve, reject) => {
    const store = createStore();
    const app = new Vue({
      store,
      render: h => h(App)
    });

    return new Promise(resolve => {
      if (app.asyncData) {
        resolve(app.asyncData({ store }));
      } else {
        resolve({});
      }
    }).then((res) => {
      console.log('res: ', res);
      context.state = store.state;
      resolve(app);
    });
  })
};
