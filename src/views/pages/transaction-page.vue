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
import { Category } from "@/entities/category";
import CategoryUseCase from "@/use-cases/category/types";
import ExpenseModal from "../components/transaction/expense-modal.vue";
import IncomeModal from "../components/transaction/income-modal.vue";
import { Transaction } from "@/entities/transaction";
import { TransactionType } from "@/enums/transaction";
import TransactionUseCase from "@/use-cases/transaction/types";
import TransferModal from "../components/transaction/transfer-modal.vue";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import WalletCard from "../components/wallet/wallet-card.vue";
import WalletModal from "../components/wallet/wallet-modal.vue";
import WalletUseCase from "@/use-cases/wallet/types";
import { formatDate } from "@/modules/date";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const { t } = useLocale();
const toast = useToast();

// Category Hook
const {
  categories,
  loadCategories,
} = (() => {
  const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;

  const categories = ref({} as Record<number, Category>);

  return {
    categories,

    loadCategories: async () => {
      const categoriesResult = await categoryUseCase.getAllCategories();
      if (categoriesResult.isError()) {
        await toast.error({ error: categoriesResult.getError()! });
        return;
      }

      for (const category of categoriesResult.getValue()) {
        categories.value[category.id!] = category;
      }
    },
  }
})();

// Wallet/Transaction Hook
const {
  transactions, wallets,
  currentWallet,

  loadWallets, loadTransactions,

  formatAmount,

  removeTransaction,

  // Modals
  handleCreateWalletModal,
  handleCreateExpenseModal,
  handleCreateIncomeModal,
  handleCreateTransferModal,
} = (() => {
  const transactionUseCase = inject(UseCases.TRANSACTION) as TransactionUseCase;
  const walletUseCase = inject(UseCases.WALLET) as WalletUseCase;

  const transactions = ref([] as Transaction[]);
  const wallets = ref([] as Wallet[]);
  const currentWallet = ref(null as Wallet | null);

  const updateWalletFromList = (wallet: Wallet) => {
    const index = wallets.value.findIndex(w => w.id === wallet.id);
    if (index > -1) {
      wallets.value[index].amount = wallet.amount;
    }
  };

  const removeTransactionFromList = (transactionId: number) => {
    const index = transactions.value.findIndex(t => t.id === transactionId);
    if (index > -1) {
      transactions.value.splice(index, 1);
    }
  };

  return {
    transactions, wallets,
    currentWallet,

    loadWallets: async () => {
      const walletsResult = await walletUseCase.getAllWallets();
      if (walletsResult.isError()) {
        await toast.error({ error: walletsResult.getError()! });
        return;
      }

      wallets.value = walletsResult.getValue();
      currentWallet.value = walletsResult.getValue()[0];
    },

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

      const result = await walletUseCase.createWallet(data);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
        return;
      }

      wallets.value.push(result.getValue());
      if (!currentWallet.value) {
        currentWallet.value = result.getValue();
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

    formatAmount: (transaction: Transaction) => {
      let symbol = "+";

      if (transaction.type === TransactionType.EXPENSE) {
        symbol = "-";
      } else if (transaction.type === TransactionType.TRANSFER) {
        if (currentWallet.value?.id === transaction.walletSourceId) {
          symbol = "-";
        }
      }

      return `${symbol}${transaction.amount}`;
    },

    removeTransaction: async (transactionId: number) => {
      const result = await transactionUseCase.removeTransaction(transactionId);
      if (result.isError()) {
        await toast.error({ error: result.getError()! });
        return;
      }

      const { sourceWallet, destinationWallet } = result.getValue();
      removeTransactionFromList(transactionId);
      updateWalletFromList(sourceWallet);
      if (destinationWallet) {
        updateWalletFromList(destinationWallet);
      }
    },

    handleCreateExpenseModal: async () => {
      if (currentWallet.value === null) {
        return;
      }

      const modalResult = await showModal<Transaction>(ExpenseModal, {
        walletId: currentWallet.value.id!,
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
      updateWalletFromList(wallet);
    },

    handleCreateIncomeModal: async () => {
      if (currentWallet.value === null) {
        return;
      }

      const modalResult = await showModal<Transaction>(IncomeModal, {
        walletId: currentWallet.value.id!,
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
      updateWalletFromList(wallet);
    },

    handleCreateTransferModal: async () => {
      if (currentWallet.value === null) {
        return;
      }

      if (wallets.value.length === 1) {
        await toast.errorCode({ code: "NO_DESTINATION_WALLET" });
        return;
      }

      const modalResult = await showModal<Transaction>(TransferModal, {
        walletId: currentWallet.value.id!,
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
      updateWalletFromList(sourceWallet);
      updateWalletFromList(destinationWallet);
    },
  };
})();

onMounted(async () => {
  await loadCategories();
  await loadWallets();

  if (wallets.value.length > 0) {
    await loadTransactions(wallets.value[0].id!);
  }
});

const onSlideChanged = async (event: any) => {
  const { activeIndex: index } = event;

  if (index < 0 || index > wallets.value.length) {
    return;
  }

  if (index === wallets.value.length) {
    currentWallet.value = null;
    transactions.value = [];
    return;
  }

  const wallet = wallets.value[index];
  if (wallet.id === currentWallet.value?.id) {
    return;
  }
  currentWallet.value = wallet;
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
            :slidesPerView="3"
            :spaceBetween="30"
            :centeredSlides="true"
            :pagination="{
              clickable: true,
            }"
            @slide-change="onSlideChanged"
          >
            <swiper-slide v-for="wallet in wallets"
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
                <div class="transaction-item"
                  :style="{
                    backgroundColor: categories[transaction.categoryId].color
                  }"
                >
                  <div class="transaction-icon">
                    <img :src="categories[transaction.categoryId].icon" />
                  </div>
                  <div class="transaction-name">
                    {{ categories[transaction.categoryId].name }}
                  </div>
                  <div class="transaction-amount">
                    {{ formatAmount(transaction) }}
                  </div>
                  <div class="transaction-timestamp">
                    {{ formatDate(transaction.timestamp!, "h:MM A") }}
                  </div>
                </div>
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

  .transaction-item {
    display: grid;
    grid-template-columns: 32px 4fr 1fr;
    width: 100%;

    padding: 8px 16px;
    border-radius: 4px;

    .transaction-icon {
      grid-row: 1 / span 2;
      grid-column: 1;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .transaction-name {
      grid-row: 1;
      grid-column: 2;

      padding-left: 8px;
      font-weight: 700;
    }

    .transaction-amount {
      grid-row: 1;
      grid-column: 3;

      text-align: end;
      font-weight: 700;
    }

    .transaction-timestamp {
      grid-row: 2;
      grid-column: 3;

      text-align: end;
      font-size: 12px;
    }

  }

}
</style>
