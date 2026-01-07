<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { provide, ref } from "vue";
import { close } from "ionicons/icons";
import useLocale from "@/composables/locale";

const props = defineProps<{
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  close: [];
}>();

const { t } = useLocale();

const validation = ref({} as Record<string, boolean>);
const valid = ref(false);

provide("setValidation", (key: string, value: boolean) => {
  validation.value[key] = value;
  valid.value = value && !Object.values(validation.value).includes(false);
});

provide("removeValidation", (key: string) => {
  delete validation.value[key];
  valid.value = !Object.values(validation.value).includes(false);
});

const onConfirm = () => {
  if (valid.value) {
    return;
  }

  emit("confirm");
}
</script>

<template>
  <slot name="header">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ props.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emit('close')">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  </slot>

  <slot />

  <slot name="footer">
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="emit('cancel')">
          {{ props.cancelLabel || t("general.cancel") }}
        </ion-button>
        <ion-button :disabled="!valid"
          @click="onConfirm"
        >
          {{ props.confirmLabel || t("general.confirm") }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </slot>
</template>
