<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { ref, watch } from "vue";
import { Wallet } from "@/entities/wallet";
import { trash } from "ionicons/icons";
import useLocale from "@/composables/locale";

const props = defineProps<{
  wallet: Wallet;
}>();
const emit = defineEmits<{
  remove: [];
}>();

const { m } = useLocale();

const wallet = ref(props.wallet);

watch(() => props.wallet, () => wallet.value = props.wallet);
</script>

<template>
  <div class="wallet-card ion-padding"
    :style="{
      backgroundColor: wallet.color,
    }"
  >
    <div class="wallet-name">{{ wallet.name }}</div>
    <div class="wallet-amount">{{ m(wallet.amount) }}</div>

    <!-- TODO: Create a proper way for deleting this -->
    <div class="wallet-remove">
      <ion-button fill="clear"
        @click="emit('remove')"
        color="light"
      >
        <ion-icon :icon="trash" />
      </ion-button>
    </div>
  </div>
</template>

<style scoped>
.wallet-card {
  display: grid;

  border-radius: 4px;
  color: black;

  aspect-ratio: 1.6;
  min-width: 300px;
  max-width: 600px;

  .wallet-name {
    grid-row: 1;
    grid-column: 1;

    text-align: start;
    font-weight: 700;
    text-overflow: ellipsis;
  }

  .wallet-amount {
    grid-row: 2;
    grid-column: 1 / span 2;

    display: flex;
    justify-content: end;
    align-items: end;

    font-weight: 700;
  }

  .wallet-remove {
    grid-row: 1;
    grid-column: 2;

    margin-left: auto;
  }
}
</style>
