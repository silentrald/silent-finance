<script setup lang="ts">
import { IonSelectOption } from "@ionic/vue";

const props = defineProps<{
  value: string;
}>();
</script>

<template>
  <ion-select-option :value="props.value">
    <slot />
  </ion-select-option>
</template>
