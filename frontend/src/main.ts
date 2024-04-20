// css -------------------------------------------------///
import './styles/main.scss';
import './assets/fontello/css/fontello.css';

// TS Module -------------------------------------------///
import { createApp, ref } from 'vue';

// plugins ---------------------------------------------///
import VITE_env from './plugins/vite_env';
import router from './router';

import App from './App.vue';

const windowWidth = ref<number>(window.innerWidth);
window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});

createApp(App)
  .provide('windowWidth', windowWidth)
  .use(router)
  .use(VITE_env)
  .mount('#app');
