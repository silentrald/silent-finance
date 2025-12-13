<script setup lang="ts">
import { Wallet } from "@/entities/wallet";
import { ref } from "vue";

const { wallet: walletProps } = defineProps<{
  wallet: Wallet;
}>();
// const emit = defineEmits<{
//   update: [ wallet: Wallet ],
//   remove: [ walletId: number ],
// }>();

const wallet = ref(walletProps);
</script>

<template>
  <div class="wallet-card"
    :style="{
      backgroundColor: wallet.color,
    }"
  >
    <div class="wallet-name">{{ wallet.name }}</div>
    <div class="wallet-amount">{{ wallet.amount }}</div>
    <!-- <input v-model="wallet.name" /> -->
    <!-- <input v-model="wallet.amount" /> -->
    <!-- <button @click="emit('update', wallet)">Update</button> -->
    <!-- <button @click="emit('remove', walletProps.id!)">Delete</button> -->
  </div>
</template>

<style scoped>
.wallet-card {
  /* custom sizing? */
  position: relative;
  height: 150px;
  width: 500px;
  border-radius: 8px;
  padding: 4px;

  .wallet-name {
    text-align: start;
  }

  .wallet-amount {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
