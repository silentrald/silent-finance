import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabPage from "../views/pages/TabPage.vue";

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
        component: () => import("../views/pages/TransactionPage.vue"),
      },
      {
        path: "category",
        component: () => import("../views/pages/CategoryPage.vue"),
      },
      {
        path: "settings",
        component: () => import("../views/pages/SettingsPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
