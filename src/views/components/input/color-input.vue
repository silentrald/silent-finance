<script setup lang="ts">
import { IonButton, IonPopover } from "@ionic/vue";
import { ChromePicker } from "vue-color";
import { ref } from "vue";

const color = defineModel();

const props = defineProps<{
  label?: string;
}>();

const open = ref(false);
</script>

<template>
  <div class="color-input">
    <div class="color-container">
      <div>{{ props.label }}</div>
      <ion-button class="color-button"
        fill="clear"
        :style="{
          backgroundColor: color,
        }"
        @click="open = !open"
      />
    </div>
    <ion-popover :is-open="open">
      <chrome-picker v-model="color" />
    </ion-popover>
  </div>
</template>

<style scoped>
.color-input {
  width: 100%;

  .color-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .color-button {
      width: 32px;
      height: 32px;
    }

  }

}
</style>
