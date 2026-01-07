<script setup lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform,
} from "@ionic/vue";
import {
  pricetag,
  settings,
  wallet,
} from "ionicons/icons";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const topMargin = ref("0");

const onBeforeTabChange = (params: { tab: string }) => {
  // Custom handling for safe area
  if (!isPlatform("android")) {
    return;
  }

  if (params.tab === "home") {
    topMargin.value = "24px";
  } else {
    topMargin.value = "0";
  }
}
</script>

<template>
  <ion-page id="main-page">
    <ion-tabs @ionTabsWillChange="onBeforeTabChange">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/transaction">
          <ion-icon :icon="wallet" />
          <ion-label>{{ t("transaction.title") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="category" href="/category">
          <ion-icon :icon="pricetag" />
          <ion-label>{{ t("category.title") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings">
          <ion-icon :icon="settings" />
          <ion-label>{{ t("settings.title") }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style>
#main-page {
  margin-top: v-bind("topMargin");
}
</style>
