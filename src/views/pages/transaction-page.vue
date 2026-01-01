<script setup lang="ts">
import { CreateTransaction, Transaction } from "@/entities/transaction";
import { CreateWallet, Wallet } from "@/entities/wallet";
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonPage,
} from "@ionic/vue";
import { ModalAction, showBottomModal, showModal } from "@/modules/modal";
import { Swiper, SwiperSlide } from "swiper/vue";
import { arrowDown, arrowUp, swapVertical, trash } from "ionicons/icons";
import { inject, onMounted, ref } from "vue";
import ExpenseModal from "../components/transaction/expense-modal.vue";
import IncomeModal from "../components/transaction/income-modal.vue";
import SimpleModal from "../components/simple-modal.vue";
import TransactionItem from "../components/transaction/transaction-item.vue";
import TransactionUseCase from "@/use-cases/transaction/types";
import TransferModal from "../components/transaction/transfer-modal.vue";
import { UseCases } from "@/use-cases/consts";
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
  loadedAllTransactions,

  setCurrentWallet,
  loadNextTransactions,

  createWallet,
  removeWallet,

  createExpenseTransaction,
  createIncomeTransaction,
  createTransferTransaction,
  removeTransaction,
} = (() => {
  const MAX_ITEM = 10;
  const transactionUseCase = inject(UseCases.TRANSACTION) as TransactionUseCase;

  const currentWallet = ref(0);
  const transactions = ref([] as Transaction[]);
  const page = ref(0);
  const loadedAll = ref(false);

  const removeTransactionFromList = (transactionId: number) => {
    const index = transactions.value.findIndex(t => t.id === transactionId);
    if (index > -1) {
      transactions.value.splice(index, 1);
    }
  };

  return {
    transactions, loadedAllTransactions: loadedAll,

    setCurrentWallet: async (walletId: number) => {
      currentWallet.value = walletId;

      transactions.value = [];
      page.value = 0;
      loadedAll.value = false;
    },

    createWallet: async () => {
      const modalResult = await showModal<CreateWallet>(WalletModal);
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

    removeWallet: async (wallet: Wallet) => {
      const modalResult = await showModal(SimpleModal, {
        text: t("transaction.removeWallet", {
          wallet: wallet.name,
        }),
      });
      if (modalResult.isError()) {
        await toast.error({ error: modalResult.getError()! });
        return;
      }

      const { action } = modalResult.getValue();
      if (action !== ModalAction.CONFIRM) {
        return;
      }

      const result = await walletStore.removeWallet(wallet.id!);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
      }
    },

    // Transaction Logic

    loadNextTransactions: async () => {
      if (loadedAll.value) {
        return;
      }

      const transactionResult = await transactionUseCase.getTransactionsByWallet(
        currentWallet.value,
        { page: ++page.value, items: MAX_ITEM }
      );
      if (transactionResult.isError()) {
        await toast.error({ error: transactionResult.getError()! });
        return;
      }

      const newTransactions = transactionResult.getValue();
      if (newTransactions.length !== MAX_ITEM) {
        loadedAll.value = true;
      }

      if (newTransactions.length > 0) {
        transactions.value = transactions.value.concat(transactionResult.getValue());
      }
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

    createExpenseTransaction: async () => {
      if (walletStore.getCurrentWallet() === null) {
        return;
      }

      const modalResult = await showBottomModal<CreateTransaction>(ExpenseModal, {
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

    createIncomeTransaction: async () => {
      if (walletStore.getCurrentWallet() === null) {
        return;
      }

      const modalResult = await showBottomModal<CreateTransaction>(IncomeModal, {
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

    createTransferTransaction: async () => {
      if (walletStore.getCurrentWallet() === null) {
        return;
      }

      if (walletStore.getWallets().length === 1) {
        await toast.errorCode({ code: "NO_DESTINATION_WALLET" });
        return;
      }

      const modalResult = await showBottomModal<CreateTransaction>(TransferModal, {
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
    setCurrentWallet(walletStore.getCurrentWallet()!.id!);
    await loadNextTransactions();
  }
});

const onSlideChanged = async (event: any) => {
  const { activeIndex: index } = event;

  if (index < 0 || index > walletStore.getWallets().length) {
    return;
  }

  if (index === walletStore.getWallets().length) {
    walletStore.setCurrentWallet(null);
    setCurrentWallet(0);
    return;
  }

  const wallet = walletStore.getWallets()[index];
  if (wallet.id === walletStore.getCurrentWallet()?.id) {
    return;
  }

  walletStore.setCurrentWallet(wallet);
  setCurrentWallet(wallet.id!);
  await loadNextTransactions();
}

const onScrollBottom = async (event: InfiniteScrollCustomEvent) => {
  await loadNextTransactions();
  event.target.complete();
}
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
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
            <wallet-card :wallet="wallet"
              @remove="() => removeWallet(wallet)"
            />
          </swiper-slide>

          <swiper-slide>
            <ion-button id="add-wallet-button"
              fill="clear"
              @click="createWallet"
            >+</ion-button>
          </swiper-slide>
        </swiper>
      </div>

      <div id="transaction-buttons">
        <div class="button-container">
          <ion-button id="create-expense-button"
            expand="full"
            shape="round"
            @click="createExpenseTransaction"
          >
            <ion-icon :icon="arrowDown"
              slot="icon-only"
              size="large"
            />
          </ion-button>

          <div>{{ t("enums.transactionType.E") }}</div>
        </div>

        <div class="button-container">
          <ion-button id="create-income-button"
            expand="full"
            shape="round"
            @click="createIncomeTransaction"
          >
            <ion-icon :icon="arrowUp"
              slot="icon-only"
              size="large"
            />
          </ion-button>

          <div>{{ t("enums.transactionType.I") }}</div>
        </div>

        <div class="button-container">
          <ion-button id="create-transfer-button"
            expand="full"
            shape="round"
            @click="createTransferTransaction"
          >
            <ion-icon :icon="swapVertical"
              slot="icon-only"
              size="large"
            />
          </ion-button>

          <div>{{ t("enums.transactionType.T") }}</div>
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
        <ion-infinite-scroll :disabled="loadedAllTransactions"
          @ion-infinite="onScrollBottom"
        >
          <ion-infinite-scroll-content />
        </ion-infinite-scroll>
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
      margin-bottom: 8px;
    }
  }
}

#transaction-container {

  #transaction-title {
    margin: 8px 0;

    font-weight: 700;
    font-size: 32px;
  }

  .date-divider {
    overflow: hidden;
    text-align: center;
    margin-bottom: 8px;
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
