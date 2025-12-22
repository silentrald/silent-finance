<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import ColorInput from "../input/color-input.vue";
import { ModalAction } from "@/modules/modal";
import { Wallet } from "@/entities/wallet";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const name = ref("");
const amount = ref("");
const color = ref("#ffffff");

const confirm = () => {
  const wallet: Wallet = {
    name: name.value,
    amount: +amount.value,
    color: color.value,
  };
  modalController.dismiss(wallet, ModalAction.CONFIRM);
};

const close = () => modalController.dismiss(null, ModalAction.CLOSE);
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="close">{{ t("general.close") }}</ion-button>
      </ion-buttons>
      <ion-title>{{ t("transaction.walletModal.title") }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm" :strong="true">{{ t("general.confirm") }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-item>
      <ion-input v-model="name"
        type="text"
        label-placement="stacked"
        :label="t('transaction.walletModal.name')"
        :placeholder="t('transaction.walletModal.name')"
      />
    </ion-item>
    <ion-item>
      <ion-input v-model="amount"
        type="number"
        label-placement="stacked"
        :label="t('transaction.walletModal.amount')"
        :placeholder="t('transaction.walletModal.amount')"
      />
    </ion-item>
    <ion-item>
      <color-input v-model="color"
        :label="t('transaction.walletModal.color')"
      />
    </ion-item>
  </ion-content>
</template>

<style>
ion-modal {
  --height: 50%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 0 16px;
}

ion-modal::part(backdrop) {
  background: rgba(209, 213, 219);
  opacity: 1;
}

ion-modal ion-toolbar {
  --background: rgb(14 116 144);
  --color: white;
}
</style>
