<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { Category } from "@/entities/category";
import ColorInput from "../input/color-input.vue";
import { ModalAction } from "@/modules/modal";
import { TransactionType } from "@/enums/transaction";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const name = ref("");
const color = ref("#ffffff");
const type = ref("all" as TransactionType | "all");

const confirm = () => {
  const category: Category = {
    name: name.value,
    color: color.value,
    type: type.value === "all" ? null : type.value,
  };
  modalController.dismiss(category, ModalAction.CONFIRM);
};

const close = () => modalController.dismiss(null, ModalAction.CLOSE);
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="close">{{ t("general.close") }}</ion-button>
      </ion-buttons>
      <ion-title>{{ t("category.modal.title") }}</ion-title>
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
      <color-input v-model="color"
        :label="t('category.modal.color')"
      />
    </ion-item>
    <ion-item>
      <ion-select
        :label="t('category.modal.type')"
        :placeholder="t('category.modal.type')"
        :value="type"
        @ion-change="type = $event.detail.value"
      >
        <ion-select-option value="all">{{ t("general.all") }}</ion-select-option>
        <ion-select-option value="E">{{ t("enums.transactionType.E") }}</ion-select-option>
        <ion-select-option value="I">{{ t("enums.transactionType.I") }}</ion-select-option>
        <ion-select-option value="T">{{ t("enums.transactionType.T") }}</ion-select-option>
      </ion-select>
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
