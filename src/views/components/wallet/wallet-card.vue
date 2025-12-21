<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { Wallet } from "@/entities/wallet";
import { closeOutline } from "ionicons/icons";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { wallet: walletProps } = defineProps<{
  wallet: Wallet;
}>();
const emit = defineEmits<{
  remove: [];
}>();

const { m } = useLocale();

const wallet = ref(walletProps);
</script>

<template>
  <div class="wallet-card"
    :style="{
      backgroundColor: wallet.color,
    }"
  >
    <div class="wallet-name">{{ wallet.name }}</div>
    <div class="wallet-amount">{{ m(wallet.amount) }}</div>
    <ion-button class="wallet-remove"
      fill="clear"
      @click="emit('remove')"
    >
      <ion-icon class="wallet-remove-icon"
        slot="icon-only"
        :icon="closeOutline"
        color="light"
      />
    </ion-button>
  </div>
</template>

<style scoped>
.wallet-card {
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 8px;

  border-radius: 4px;
  color: black;

  aspect-ratio: 1.6;
  min-width: 300px;
  max-width: 600px;

  .wallet-name {
    font-weight: 700;
    text-overflow: ellipsis;
  }

  .wallet-amount {
    font-weight: 700;
  }

  .wallet-remove {
    margin-left: auto;

    .wallet-remove-icon {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
