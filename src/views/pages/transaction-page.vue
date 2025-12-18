<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { ModalAction, showModal } from "@/modules/modal";
import { inject, onMounted, ref } from "vue";
import { Category } from "@/entities/category";
import CategoryUseCase from "@/use-cases/category/types";
import ExpenseModal from "../components/transaction/expense-modal.vue";
import { Transaction } from "@/entities/transaction";
import TransactionUseCase from "@/use-cases/transaction/types";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import WalletCard from "../components/wallet/wallet-card.vue";
import WalletModal from "../components/wallet/wallet-modal.vue";
import WalletUseCase from "@/use-cases/wallet/types";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;
const transactionUseCase = inject(UseCases.TRANSACTION) as TransactionUseCase;
const walletUseCase = inject(UseCases.WALLET) as WalletUseCase;

const categories = ref({} as Record<number, Category>);
const transactions = ref([] as Transaction[]);
const wallets = ref([] as Wallet[]);

onMounted(async () => {
  await loadCategories();
  await loadWallets();

  if (wallets.value.length > 0) {
    await loadTransactions(wallets.value[0].id!);
  }
});

// Category Logic

const loadCategories = async () => {
  const categoriesResult = await categoryUseCase.getAllCategories();
  if (categoriesResult.isError()) {
    // TODO:
    return;
  }

  for (const category of categoriesResult.getValue()) {
    categories.value[category.id!] = category;
  }
}

// Wallet Logic

const loadWallets = async () => {
  const walletsResult = await walletUseCase.getAllWallets();
  if (walletsResult.isError()) {
    // TODO:
    return;
  }

  wallets.value = walletsResult.getValue();
};

const updateWalletFromList = (wallet: Wallet) => {
  const index = wallets.value.findIndex(w => w.id === wallet.id);
  if (index > -1) {
    wallets.value[index].amount = wallet.amount;
  }
}

const handleCreateWalletModal = async () => {
  const modalResult = await showModal<Wallet>(WalletModal);
  if (modalResult.isError()) {
    return;
  }

  const { action, data } = modalResult.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  const result = await walletUseCase.createWallet(data);
  if (result.isError()) {
    return;
  }

  wallets.value.push(result.getValue());
}

// Transaction Logic

const loadTransactions = async (walletId: number) => {
  const transactionResult = await transactionUseCase.getTransactionsByWallet(walletId);
  if (transactionResult.isError()) {
    // TODO:
    return;
  }

  transactions.value = transactionResult.getValue();
}

const removeTransactionFromList = (transactionId: number) => {
  const index = transactions.value.findIndex(t => t.id === transactionId);
  if (index > -1) {
    transactions.value.splice(index, 1);
  }
}

const handleCreateExpenseModal = async () => {
  const modalResult = await showModal<Transaction>(ExpenseModal);
  if (modalResult.isError()) {
    // TODO:
    return;
  }

  const { action, data } = modalResult.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  console.debug(data);
  const result = await transactionUseCase.createExpense(data);
  if (result.isError()) {
    // TODO:
    console.debug(result.getError());
    return;
  }

  const { transaction, wallet } = result.getValue();
  transactions.value.unshift(transaction);
  updateWalletFromList(wallet);
}

const removeTransaction = async (transactionId: number) => {
  const result = await transactionUseCase.removeTransaction(transactionId);
  if (result.isError()) {
    return;
  }

  const { wallet } = result.getValue();
  removeTransactionFromList(transactionId);
  updateWalletFromList(wallet);
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

          <ion-button id="add-wallet-button"
            fill="clear"
            @click="handleCreateWalletModal"
          >+</ion-button>
        </div>

        <div id="transaction-container">
          <div>
            {{ t("transaction.title") }}
          </div>

          <div>
            <div v-for="transaction in transactions"
              :key="transaction.id"
            >
              {{ transaction.type }} / {{ transaction.amount }} / {{ categories[transaction.categoryId].name }}
              <ion-button
                @click="() => removeTransaction(transaction.id!)"
              >X</ion-button>
            </div>
          </div>

          <ion-button id="add-button"
            expand="full"
            fill="clear"
            @click="handleCreateExpenseModal"
          >
            +
          </ion-button>
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

  #add-wallet-button {
    aspect-ratio: 1.6;
    min-width: 300px;
    max-width: 600px;
    width: 75%;
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
</style>
