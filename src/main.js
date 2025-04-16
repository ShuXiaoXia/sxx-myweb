import "@/assets/styles/global.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import Router from "./router/router.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// msw
async function enableMocking() {
  const { worker } = await import("./mock/browser");
  return worker.start();
}
// msw
const app = createApp(App);
app.use(createPinia());
app.use(Router);
app.use(ElementPlus);

enableMocking().then(() => {
  app.mount("#app"); //use一般在mount前面
});
