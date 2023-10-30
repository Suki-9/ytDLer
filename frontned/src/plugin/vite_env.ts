import { App } from "vue";

export const $VITE_API_URL: string = import.meta.env.VITE_API_URL;

const VITE_env = {
  install: function (app: App) {
    app.config.globalProperties.$VITE_API_URL = $VITE_API_URL;
  },
};

declare module "vue" {
  interface ComponentCustomProperties {
    $VITE_API_URL: string;
  }
}

export default VITE_env;
