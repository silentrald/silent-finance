<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import ColorInput from "../input/color-input.vue";
import { CreateCategory } from "@/entities/category";
import { HexColor } from "@/types";
import { ModalAction } from "@/modules/modal";
import { TransactionType } from "@/enums/transaction";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const name = ref("");
const color = ref("#ffffff" as HexColor);
const type = ref("all" as TransactionType | "all");

const confirm = () => {
  const category: CreateCategory = {
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
</template>

