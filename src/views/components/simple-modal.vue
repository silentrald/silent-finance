<script setup lang="ts">
import { IonButton, IonButtons, IonFooter, IonToolbar, modalController } from "@ionic/vue";
import { ModalAction } from "@/modules/modal";
import useLocale from "@/composables/locale";

const props = defineProps<{
  text: string;
  confirmText?: string;
  cancelText?: string;
}>();

const { t } = useLocale();

const confirmModal = () => {
  modalController.dismiss(null, ModalAction.CONFIRM);
}

const cancelModal = () => {
  modalController.dismiss(null, ModalAction.CANCEL);
}
</script>

<template>
  <div class="simple-modal">
    <div class="modal-text ion-padding">{{ props.text }}</div>

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
  </div>
</template>

