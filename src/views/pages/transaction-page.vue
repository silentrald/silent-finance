<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { ModalAction, showModal } from "@/modules/modal";
import { Swiper, SwiperSlide } from "swiper/vue";
import { arrowDown, arrowUp, swapVertical, trash } from "ionicons/icons";
import { inject, onMounted, ref } from "vue";
import ExpenseModal from "../components/transaction/expense-modal.vue";
import IncomeModal from "../components/transaction/income-modal.vue";
import { Transaction } from "@/entities/transaction";
import TransactionItem from "../components/transaction/transaction-item.vue";
import TransactionUseCase from "@/use-cases/transaction/types";
import TransferModal from "../components/transaction/transfer-modal.vue";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import WalletCard from "../components/wallet/wallet-card.vue";
import WalletModal from "../components/wallet/wallet-modal.vue";
import { formatDate } from "@/modules/date";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";
import useWalletStore from "@/stores/wallet";

const { t } = useLocale();
const toast = useToast();

const walletStore = useWalletStore();

// Wallet/Transaction Hook
const {
  transactions,

  loadTransactions,

  removeTransaction,

  // Modals
  handleCreateWalletModal,
  handleCreateExpenseModal,
  handleCreateIncomeModal,
  handleCreateTransferModal,
} = (() => {
  const transactionUseCase = inject(UseCases.TRANSACTION) as TransactionUseCase;

  const transactions = ref([] as Transaction[]);

  const removeTransactionFromList = (transactionId: number) => {
    const index = transactions.value.findIndex(t => t.id === transactionId);
    if (index > -1) {
      transactions.value.splice(index, 1);
    }
  };

  return {
    transactions,

    handleCreateWalletModal: async () => {
      const modalResult = await showModal<Wallet>(WalletModal);
      if (modalResult.isError()) {
        await toast.error({ error: modalResult.getError()! });
        return;
      }

      const { action, data } = modalResult.getValue();
      if (action !== ModalAction.CONFIRM) {
        return;
      }

      const result = await walletStore.createWallet(data);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
      }
    },

    // Transaction Logic

    loadTransactions: async (walletId: number) => {
      const transactionResult = await transactionUseCase.getTransactionsByWallet(walletId);
      if (transactionResult.isError()) {
        await toast.error({ error: transactionResult.getError()! });
        return;
      }

      transactions.value = transactionResult.getValue();
    },

    removeTransaction: async (transactionId: number) => {
      const result = await transactionUseCase.removeTransaction(transactionId);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
        return;
      }

      const { sourceWallet, destinationWallet } = result.getValue();
      removeTransactionFromList(transactionId);
      walletStore.updateWallet(sourceWallet);
      if (destinationWallet) {
        walletStore.updateWallet(destinationWallet);
      }
    },

    handleCreateExpenseModal: async () => {
      if (walletStore.getCurrentWallet() === null) {
        return;
      }

      const modalResult = await showModal<Transaction>(ExpenseModal, {
        walletId: walletStore.getCurrentWallet()!.id!,
      });
      if (modalResult.isError()) {
        await toast.error({ error: modalResult.getError()! });
        return;
      }

      const { action, data } = modalResult.getValue();
      if (action !== ModalAction.CONFIRM) {
        return;
      }

      const result = await transactionUseCase.createExpense(data);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
        return;
      }

      const { transaction, wallet } = result.getValue();
      transactions.value.unshift(transaction);
      walletStore.updateWallet(wallet);
    },

    handleCreateIncomeModal: async () => {
      if (walletStore.getCurrentWallet() === null) {
        return;
      }

      const modalResult = await showModal<Transaction>(IncomeModal, {
        walletId: walletStore.getCurrentWallet()!.id!,
      });
      if (modalResult.isError()) {
        await toast.error({ error: modalResult.getError()! });
        return;
      }

      const { action, data } = modalResult.getValue();
      if (action !== ModalAction.CONFIRM) {
        return;
      }

      const result = await transactionUseCase.createIncome(data);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
        return;
      }

      const { transaction, wallet } = result.getValue();
      transactions.value.unshift(transaction);
      walletStore.updateWallet(wallet);
    },

    handleCreateTransferModal: async () => {
      if (walletStore.getCurrentWallet() === null) {
        return;
      }

      if (walletStore.getWallets().length === 1) {
        await toast.errorCode({ code: "NO_DESTINATION_WALLET" });
        return;
      }

      const modalResult = await showModal<Transaction>(TransferModal, {
        walletId: walletStore.getCurrentWallet()!.id!,
      });
      if (modalResult.isError()) {
        await toast.error({ error: modalResult.getError()! });
        return;
      }

      const { action, data } = modalResult.getValue();
      if (action !== ModalAction.CONFIRM) {
        return;
      }

      const result = await transactionUseCase.createTransfer(data);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
        return;
      }

      const { transaction, sourceWallet, destinationWallet } = result.getValue();
      transactions.value.unshift(transaction);
      walletStore.updateWallet(sourceWallet);
      walletStore.updateWallet(destinationWallet);
    },
  };
})();

onMounted(async () => {
  if (walletStore.getCurrentWallet()) {
    await loadTransactions(walletStore.getCurrentWallet()!.id!);
  }
});

const onSlideChanged = async (event: any) => {
  const { activeIndex: index } = event;

  if (index < 0 || index > walletStore.getWallets().length) {
    return;
  }

  if (index === walletStore.getWallets().length) {
    walletStore.setCurrentWallet(null);
    transactions.value = [];
    return;
  }

  const wallet = walletStore.getWallets()[index];
  if (wallet.id === walletStore.getCurrentWallet()?.id) {
    return;
  }
  walletStore.setCurrentWallet(wallet);
  await loadTransactions(wallet.id!);
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
          <swiper
            :slidesPerView="1.25"
            :spaceBetween="10"
            :centeredSlides="true"
            @slide-change="onSlideChanged"
          >
            <swiper-slide v-for="wallet in walletStore.getWallets()"
              :key="wallet.id"
            >
              <wallet-card :wallet="wallet" />
            </swiper-slide>

            <swiper-slide>
              <ion-button id="add-wallet-button"
                fill="clear"
                @click="handleCreateWalletModal"
              >+</ion-button>
            </swiper-slide>
          </swiper>
        </div>

        <div id="transaction-buttons">
          <div class="button-container">
            <ion-button id="create-expense-button"
              expand="full"
              shape="round"
              @click="handleCreateExpenseModal"
            >
              <ion-icon :icon="arrowDown"
                slot="icon-only"
                size="large"
              />
            </ion-button>

            <div>Expense</div>
          </div>

          <div class="button-container">
            <ion-button id="create-income-button"
              expand="full"
              shape="round"
              @click="handleCreateIncomeModal"
            >
              <ion-icon :icon="arrowUp"
                slot="icon-only"
                size="large"
              />
            </ion-button>

            <div>Income</div>
          </div>

          <div class="button-container">
            <ion-button id="create-transfer-button"
              expand="full"
              shape="round"
              @click="handleCreateTransferModal"
            >
              <ion-icon :icon="swapVertical"
                slot="icon-only"
                size="large"
              />
            </ion-button>

            <div>Transfer</div>
          </div>
        </div>

        <div id="transaction-container">
          <div id="transaction-title">
            {{ t("transaction.title") }}
          </div>
          <div v-for="(transaction, index) in transactions"
            :key="transaction.id"
          >
            <div v-if="
              index === 0
              || formatDate(transactions[index - 1].timestamp!, 'YYYY-MM-DD') !== formatDate(transaction.timestamp!, 'YYYY-MM-DD')"
              class="date-divider"
            >
              {{ formatDate(transaction.timestamp!, "MMMM D") }}
            </div>

            <ion-item-sliding class="transaction-slide">
              <ion-item>
                <transaction-item :transaction="transaction" />
              </ion-item>

              <ion-item-options side="end">
                <ion-item-option color="danger" @click="() => removeTransaction(transaction.id!)">
                  <ion-icon slot="icon-only" :icon="trash"/>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#wallet-container {

  #add-wallet-button {
    aspect-ratio: 1.6;
    min-width: 300px;
    max-width: 600px;
    margin: 0;

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

  #add-wallet-button:hover {
    color: black;
    background-color: white;
    border-color: black;
  }

}

#transaction-buttons {
  display: flex;
  justify-content: space-evenly;
  margin: 16px 0;

  .button-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    #create-expense-button,
    #create-income-button,
    #create-transfer-button {
      aspect-ratio: 1;
      width: 64px;
      margin: 0 0 8px 0;
    }
  }
}

#transaction-container {

  #transaction-title {
    margin: 8px 16px;

    font-weight: 700;
    font-size: 32px;
  }

  .date-divider {
    overflow: hidden;
    text-align: center;
    margin: 0 16px 8px 16px;
  }

  .date-divider::before,
  .date-divider::after {
    background-color: white;
    content: "";
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  .date-divider::before {
    right: 0.5em;
    margin-left: -50%;
  }

  .date-divider::after {
    left: 0.5em;
    margin-right: -50%;
  }

  .transaction-slide {
    margin-bottom: 8px;
  }

}
</style>
