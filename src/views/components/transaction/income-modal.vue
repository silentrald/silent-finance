<script setup lang="ts">
import {
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  modalController,
} from "@ionic/vue";
import { AmountCount } from "@/dtos/denomination";
import { CreateTransaction } from "@/entities/transaction";
import { CreateTransactionDenomination } from "@/entities/transaction-denomination";
import DenominationInput from "../denomination/denomination-input.vue";
import { ModalAction } from "@/modules/modal";
import NumberInput from "../input/number-input.vue";
import { TransactionType } from "@/enums/transaction";
import { ref } from "vue";
import useCategoryStore from "@/stores/category";
import useLocale from "@/composables/locale";
import useWalletStore from "@/stores/wallet";

const { walletId } = defineProps<{
  walletId: number;
}>();

const { t } = useLocale();
const categoryStore = useCategoryStore();
const walletStore = useWalletStore();

const amount = ref(0);
const description = ref("");
const categoryId = ref("");
const denominationData = ref({
  amountCount: {},
  total: 0,
} as {
  // id: count
  amountCount: Record<number, AmountCount>;
  total: number;
})

const getCurrencyId = () => walletStore.getWalletById(walletId).currencyId;
const hasDenomination = () => walletStore.getWalletById(walletId).hasDenomination;

// === Events === //

const confirmModal = () => {
  let denominations: CreateTransactionDenomination[] | null = null;
  if (hasDenomination()) {
    denominations = [];
    const ref = denominationData.value.amountCount;
    for (const id in ref) {
      denominations.push({
        denominationId: +id,
        count: ref[id].count,
      });
    }
  }

  const transaction: CreateTransaction = {
    type: TransactionType.EXPENSE,
    amount: amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: walletId,
    denominations,
  };
  modalController.dismiss(transaction, ModalAction.CONFIRM);
};
</script>

<template>
  <div class="ion-padding">
    <ion-select required
      :label="t('transaction.incomeModal.category')"
      :placeholder="t('transaction.incomeModal.category')"
      @ion-change="categoryId = $event.detail.value"
    >
      <ion-select-option v-for="category in categoryStore.getIncomeCategories()"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </ion-select-option>
    </ion-select>

    <template v-if="hasDenomination()">
      <ion-input v-model="description"
        type="text"
        :placeholder="t('transaction.expenseModal.description')"
      />
      <denomination-input v-model="denominationData"
        :currency-id="getCurrencyId()"
        support-negative
      />
      <ion-button @click="confirmModal">Confirm</ion-button>
    </template>
    <template v-else>
      <number-input v-model="amount"
        @confirm="confirmModal"
      >
        <ion-input v-model="description"
          type="text"
          :placeholder="t('transaction.incomeModal.description')"
        />
      </number-input>
    </template>
  </div>
</template>

<style>
ion-modal#income-modal {
  --border-radius: 16px 16px 0 0;
}
</style>

