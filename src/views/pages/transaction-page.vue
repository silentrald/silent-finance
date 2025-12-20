<script setup lang="ts">
import { Carousel, Slide } from "vue3-carousel";
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { ModalAction, showModal } from "@/modules/modal";
import { inject, onMounted, ref } from "vue";
import { Category } from "@/entities/category";
import CategoryUseCase from "@/use-cases/category/types";
import ExpenseModal from "../components/transaction/expense-modal.vue";
import IncomeModal from "../components/transaction/income-modal.vue";
import { Transaction } from "@/entities/transaction";
import TransactionUseCase from "@/use-cases/transaction/types";
import TransferModal from "../components/transaction/transfer-modal.vue";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import WalletCard from "../components/wallet/wallet-card.vue";
import WalletModal from "../components/wallet/wallet-modal.vue";
import WalletUseCase from "@/use-cases/wallet/types";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const { t } = useLocale();
const toast = useToast();

const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;
const transactionUseCase = inject(UseCases.TRANSACTION) as TransactionUseCase;
const walletUseCase = inject(UseCases.WALLET) as WalletUseCase;

const categories = ref({} as Record<number, Category>);
const transactions = ref([] as Transaction[]);
const wallets = ref([] as Wallet[]);

const currentWallet = ref(null as Wallet | null);

onMounted(async () => {
  await loadCategories();
  await loadWallets();

  if (wallets.value.length > 0) {
    await loadTransactions(wallets.value[0].id!);
  }
});

const onSlideMoved = async ({ currentSlideIndex }: any) => {
  if (
    currentSlideIndex < 0
    || currentSlideIndex >= wallets.value.length
  ) {
    return;
  }

  const wallet = wallets.value[currentSlideIndex];
  if (wallet.id === currentWallet.value?.id) {
    return;
  }
  currentWallet.value = wallet;
  await loadTransactions(wallet.id!);
}

// Category Logic

const loadCategories = async () => {
  const categoriesResult = await categoryUseCase.getAllCategories();
  if (categoriesResult.isError()) {
    await toast.error({ error: categoriesResult.getError()! });
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
    await toast.error({ error: walletsResult.getError()! });
    return;
  }

  wallets.value = walletsResult.getValue();
  currentWallet.value = walletsResult.getValue()[0];
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
}

// Transaction Logic

const loadTransactions = async (walletId: number) => {
  const transactionResult = await transactionUseCase.getTransactionsByWallet(walletId);
  if (transactionResult.isError()) {
    await toast.error({ error: transactionResult.getError()! });
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
}

const handleCreateIncomeModal = async () => {
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
}

const handleCreateTransferModal = async () => {
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
}

const removeTransaction = async (transactionId: number) => {
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
          <carousel :items-to-show="2.5"
            @slide-end="onSlideMoved"
          >
            <slide v-for="wallet in wallets"
              :key="wallet.id"
            >
              <wallet-card :wallet="wallet" />
            </slide>

            <slide>
              <ion-button id="add-wallet-button"
                fill="clear"
                @click="handleCreateWalletModal"
              >+</ion-button>
            </slide>
          </carousel>
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

          <ion-button v-if="currentWallet"
            id="add-button"
            expand="full"
            fill="clear"
            @click="handleCreateExpenseModal"
          >
            Expense
          </ion-button>
          <ion-button v-if="currentWallet"
            id="add-button"
            expand="full"
            fill="clear"
            @click="handleCreateIncomeModal"
          >
            Income
          </ion-button>
          <ion-button v-if="currentWallet"
            id="add-button"
            expand="full"
            fill="clear"
            @click="handleCreateTransferModal"
          >
            Transfer
          </ion-button>
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
</style>
