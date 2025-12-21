<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { Transaction } from "@/entities/transaction";
import { TransactionType } from "@/enums/transaction";
import { arrowForward } from "ionicons/icons";
import { formatDate } from "@/modules/date";
import { ref } from "vue";
import useCategoryStore from "@/stores/category";
import useLocale from "@/composables/locale";
import useWalletStore from "@/stores/wallet";

const props = defineProps<{
  transaction: Transaction;
}>();

const { m } = useLocale();

const categoryStore = useCategoryStore();
const walletStore = useWalletStore();

const transaction = ref(props.transaction);

const formatAmount = (transaction: Transaction) => {
  let symbol = "+";

  if (
    transaction.type === TransactionType.EXPENSE
    || (
      transaction.type === TransactionType.TRANSFER
      && walletStore.getCurrentWallet()!.id === transaction.walletSourceId
    )
  ) {
    symbol = "-";
  }

  return `${symbol}${m(transaction.amount)}`;
};
</script>

<template>
  <div class="transaction-item"
    :style="{
      backgroundColor: categoryStore.getCategory(transaction.categoryId).color
    }"
  >
    <div class="transaction-icon">
      <img :src="categoryStore.getCategory(transaction.categoryId).icon" />
    </div>

    <div v-if="transaction.type === TransactionType.TRANSFER" class="transaction-name">
      <div>{{ walletStore.getWalletById(transaction.walletSourceId).name }}</div>
      <ion-icon :icon="arrowForward" />
      <div>{{ walletStore.getWalletById(transaction.walletDestinationId!).name }}</div>
    </div>
    <div v-else class="transaction-name">
      {{ categoryStore.getCategory(transaction.categoryId).name }}
    </div>

    <div class="transaction-amount">
      {{ formatAmount(transaction) }}
    </div>
    <div class="transaction-timestamp">
      {{ formatDate(transaction.timestamp!, "h:MM A") }}
    </div>
  </div>
</template>

<style scoped>
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

    display: flex;
    align-items: center;
    column-gap: 4px;

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
</style>
