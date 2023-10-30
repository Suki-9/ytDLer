import { App } from "vue";

export const $API_URL: string = import.meta.env.VITE_API_URL;

const VITE_env = {
  install: function (app: App) {
    app.config.globalProperties.$API_URL = $API_URL;
  },
};

declare module "vue" {
  interface ComponentCustomProperties {
    $API_URL: string;
  }
}

export default VITE_env;
