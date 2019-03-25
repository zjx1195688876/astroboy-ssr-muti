import { createApp } from './app';
import App from './index.vue';


export default context => {
  return new Promise((resolve, reject) => {
    const { app, store } = createApp();
    if (App.asyncData) {
      Promise.all([App].map((item) => {
        return item.asyncData({ store });
      }))
        .then(() => {
          context.state = store.state;
          resolve(app);
        })
    }
  })
};
