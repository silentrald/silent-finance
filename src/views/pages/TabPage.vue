<script setup lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';
import {
  pricetag,
  settings,
  wallet,
} from 'ionicons/icons';
import useLocale from '@/composables/locale';

const { t } = useLocale();
</script>

<template>
  <ion-page>
    <ion-tabs>
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
