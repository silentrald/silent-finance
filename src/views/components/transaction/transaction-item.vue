<script setup lang="ts">
import { inject, ref } from "vue";
import { AmountCount } from "@/dtos/denomination";
import DenominationUseCase from "@/use-cases/denomination/types";
import { IonIcon } from "@ionic/vue";
import { Transaction } from "@/entities/transaction";
import { TransactionType } from "@/enums/transaction";
import { UseCases } from "@/use-cases/consts";
import { arrowForward } from "ionicons/icons";
import { calculateForegroundColor } from "@/modules/color";
import { formatDate } from "@/modules/date";
import useCategoryStore from "@/stores/category";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";
import useWalletStore from "@/stores/wallet";

const props = defineProps<{
  transaction: Transaction;
  walletId: number;
}>();

const { m } = useLocale();
const toast = useToast();

const categoryStore = useCategoryStore();
const walletStore = useWalletStore();
const denominationUseCase = inject(UseCases.DENOMINATION) as DenominationUseCase;

const transaction = ref(props.transaction);
const showInfo = ref(false);
const denominations = ref(null as AmountCount[] | null);

const formatAmount = (transaction: Transaction) => {
  let symbol = "+";

  if (
    transaction.type === TransactionType.EXPENSE
    || (
      transaction.type === TransactionType.TRANSFER
      && props.walletId === transaction.walletSourceId
    )
  ) {
    symbol = "-";
  }

  return `${symbol}${m(Math.abs(transaction.amount))}`;
};

const getCurrencyId = () => walletStore.getWalletById(transaction.value.walletSourceId).currencyId;
const hasDenomination = () => walletStore.getWalletById(transaction.value.walletSourceId).hasDenomination;

const toggleInfo = async () => {
  showInfo.value = !showInfo.value;

  if (
    !showInfo.value
    || denominations.value
    || !hasDenomination()
  ) {
    return;
  }

  const result = await denominationUseCase
    .getAmountCountOfTransaction(transaction.value.id);
  if (result.isError()) {
    await toast.error({ error: result.getError()! });
    return;
  }

  if (
    props.transaction.type === TransactionType.TRANSFER
    && props.transaction.walletDestinationId === props.walletId
  ) {
    denominations.value = result.getValue()
      .map(d => ({ ...d, count: d.count * -1 }));
  } else {
    denominations.value = result.getValue();
  }
}
</script>

<template>
  <div class="transaction-item">
    <div class="transaction-content"
      :style="{
        backgroundColor: categoryStore.getCategory(transaction.categoryId).color,
        color: calculateForegroundColor(categoryStore.getCategory(transaction.categoryId).color),
      }"
      @click="toggleInfo"
    >
      <div class="transaction-icon">
        <img :src="categoryStore.getCategory(transaction.categoryId).icon || '/images/help-outline.png'" />
      </div>

      <div class="transaction-name">
        {{ categoryStore.getCategory(transaction.categoryId).name }}
      </div>

      <div v-if="transaction.type === TransactionType.TRANSFER"
        class="transaction-info"
      >
        <div>{{ walletStore.getWalletById(transaction.walletSourceId).name }}</div>
        <ion-icon :icon="arrowForward" />
        <div>{{ walletStore.getWalletById(transaction.walletDestinationId!).name }}</div>
      </div>

      <div class="transaction-amount">
        {{ formatAmount(transaction) }}
      </div>
      <div class="transaction-timestamp">
        {{ formatDate(transaction.timestamp!, "h:MM A") }}
      </div>
    </div>

    <template v-if="showInfo">
      <div v-if="transaction.description" class="transaction-description">
        {{ transaction.description }}
      </div>

      <table v-if="denominations" class="transaction-denomination">
        <tbody>
          <tr>
            <th class="transaction-denomination-amount">Amount</th>
            <th class="transaction-denomination-count">Count</th>
          </tr>

          <tr v-for="denomination in denominations"
            :key="denomination.amount"
          >
            <td class="transaction-denomination-amount">
              {{ getCurrencyId() }} {{ m(denomination.amount) }}
            </td>
            <td class="transaction-denomination-count">
              {{ denomination.count }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
.transaction-item {
  width: 100%;

  .transaction-content {
    display: grid;
    grid-template-columns: 32px 4fr 1fr;

    padding: 8px 16px;
    border-radius: 4px;

    height: 60px;

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

    .transaction-info {
      grid-row: 2;
      grid-column: 2;

      display: flex;
      align-items: center;
      column-gap: 4px;

      padding-left: 8px;
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

  .transaction-description {
    padding: 8px 16px;
    border-radius: 4px;
  }

  .transaction-denomination {
    width: 100%;

    .transaction-denomination-amount {
      text-align: left;
    }

    .transaction-denomination-count {
      text-align: right;
    }
  }
}
</style>
