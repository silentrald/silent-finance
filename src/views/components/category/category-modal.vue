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
import { Category } from "@/entities/category";
import { ChromePicker } from "vue-color";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const name = ref("");
const color = ref("#ffffff");

const confirm = () => {
  const category: Category = {
    name: name.value,
    color: color.value,
  };
  modalController.dismiss(category, "confirm");
};

const close = () => modalController.dismiss(null, "close");
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="close">{{ t("general.close") }}</ion-button>
      </ion-buttons>
      <ion-title>{{ t("category.modal.addCategory") }}</ion-title>
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
        :label="t('category.modal.name')"
        :placeholder="t('category.modal.name')"
      />
    </ion-item>
    <ion-item>
      <!-- TODO: create a component for this -->
      <chrome-picker v-model="color" />
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
