import { createWebHistory, createRouter } from "vue-router";

import HomeView from "/src/views/HomeView.vue"; //静态导入，增加代码包体积
//动态导入
// const HomeView = () => import("/src/views/HomeView.vue");
const LoginRegisterView = () =>
  import("/src/views/login/LoginRegisterView.vue");
// const GoodsView = () => import("/src/views/store/GoodsList.vue");
// const GoodsDetailView = () => import("/src/views/store/GoodsDetail.vue");
const CenterView = () => import("/src/views/my-center/MyCenter.vue");

const routes = [
  { path: "/home", component: HomeView },
  { path: "/login-register", component: LoginRegisterView },
  // {
  //   path: "/goods",
  //   component: GoodsView,
  //   children: [{ path: "/detail", component: GoodsDetailView }],
  // },
  { path: "/my-center", component: CenterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
