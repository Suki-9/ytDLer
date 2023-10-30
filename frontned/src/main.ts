// css -------------------------------------------------///
import "./styles/main.css";

// TS Module -------------------------------------------///
import { createApp } from "vue";

// plugins ---------------------------------------------///
import VITE_env from "./plugins/vite_env";
import router from "./router";

import App from "./App.vue";

createApp(App).use(router).use(VITE_env).mount("#app");
