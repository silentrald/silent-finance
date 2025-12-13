import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabPage from "../views/pages/tab-page.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/transaction",
  },
  {
    path: "/",
    component: TabPage,
    children: [
      {
        path: "",
        redirect: "/transaction",
      },
      {
        path: "transaction",
        component: () => import("../views/pages/transaction-page.vue"),
      },
      {
        path: "category",
        component: () => import("../views/pages/category-page.vue"),
      },
      {
        path: "settings",
        component: () => import("../views/pages/settings-page.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
