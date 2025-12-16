<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { ModalAction, showModal } from "@/modules/modal";
import { inject, onMounted, ref } from "vue";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import WalletCard from "../components/wallet/wallet-card.vue";
import WalletModal from "../components/wallet/wallet-modal.vue";
import WalletUseCase from "@/use-cases/wallet/types";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const walletUseCase = inject(UseCases.WALLET) as WalletUseCase;
const wallets = ref([] as Wallet[]);

onMounted(() => {
  loadWallets();
});

const loadWallets = async () => {
  const walletsResult = await walletUseCase.getAllWallets();
  if (walletsResult.isError()) {
    // TODO:
    return;
  }

  wallets.value = walletsResult.getValue();
};

const showCreateWalletModal = async () => {
  const modalResult = await showModal<Wallet>(WalletModal);
  if (modalResult.isError()) {
    // TODO:
    return;
  }

  const { action, data } = modalResult.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  const result = await walletUseCase.createWallet(data);
  if (result.isError()) {
    // TODO:
    return;
  }

  wallets.value.push(result.getValue());
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ t("transaction.title") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t("transaction.title") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div id="wallet-container">
          <div v-for="wallet in wallets" :key="wallet.id">
            <wallet-card :wallet="wallet" />
          </div>
          <ion-button id="create-wallet-button"
            fill="clear"
            @click="showCreateWalletModal"
          >+</ion-button>
        </div>

        <div id="transaction-container">
          Transactions
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#wallet-container {
  display: flex;
  column-gap: 16px;
  padding: 8px 16px;
  overflow-x: scroll;

  #create-wallet-button {
    aspect-ratio: 1.6;
    min-width: 300px;
    max-width: 600px;
    width: 75%;

    border: 2px dashed white;
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    /* Plus sign */
    color: white;
    font-size: 48px;
    font-weight: 700;
  }

  #create-wallet-button:hover {
    color: black;
    background-color: white;
    border-color: black;
  }
}
</style>
