<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonFooter,
  IonItem,
  IonRadio,
  IonRadioGroup,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { ModalAction } from "@/modules/modal";
import { ref } from "vue";
import useLocale from "@/composables/locale";

interface Option {
  value: string;
  text: string;
}

const props = defineProps<{
  options: Option[];
  confirmText?: string;
  cancelText?: string;
}>();

const { t } = useLocale();

const value = ref("");

const confirmModal = () => {
  modalController.dismiss(value.value, ModalAction.CONFIRM);
}

const cancelModal = () => {
  modalController.dismiss(null, ModalAction.CANCEL);
}
</script>

<template>
  <ion-radio-group v-model="value">
    <ion-item v-for="option in (props.options || [])"
      :key="option.value"
    >
      <ion-radio :value="option.value">
        {{ option.text }}
      </ion-radio>
    </ion-item>
  </ion-radio-group>

  <ion-footer>
    <ion-toolbar color="clear">
      <ion-buttons slot="end">
        <ion-button @click="cancelModal" color="secondary">
          {{ props.cancelText || t("general.cancel") }}
        </ion-button>
        <ion-button @click="confirmModal" color="primary">
          {{ props.confirmText || t("general.confirm") }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>
