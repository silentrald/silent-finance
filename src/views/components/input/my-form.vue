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

const props = withDefaults(defineProps<{
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  hideButtons?: boolean;
}>(), {
  hideButtons: false,
});

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
    emit("confirm");
  }
}
</script>

<template>
  <slot name="header">
    <ion-header>
      <ion-toolbar>
        <ion-title v-if="props.title">{{ props.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emit('close')">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  </slot>

  <slot name="before-content" />

  <slot />

  <slot name="after-content" />

  <slot name="footer">
    <ion-toolbar v-if="!props.hideButtons">
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
