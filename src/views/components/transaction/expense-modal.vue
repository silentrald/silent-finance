<script setup lang="ts">
import {
  IonInput,
  IonSelect,
  IonSelectOption,
  modalController,
} from "@ionic/vue";
import { CreateTransaction } from "@/entities/transaction";
import { ModalAction } from "@/modules/modal";
import NumberInput from "../input/number-input.vue";
import { TransactionType } from "@/enums/transaction";
import { ref } from "vue";
import useCategoryStore from "@/stores/category";
import useLocale from "@/composables/locale";

const { walletId } = defineProps<{
  walletId: number;
}>();

const { t } = useLocale();
const categoryStore = useCategoryStore();

const amount = ref(0);
const description = ref("");
const categoryId = ref("");

const confirmModal = () => {
  const transaction: CreateTransaction = {
    type: TransactionType.EXPENSE,
    amount: amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: walletId,
  };
  modalController.dismiss(transaction, ModalAction.CONFIRM);
};
</script>

<template>
  <div class="ion-padding">
    <ion-select
      :label="t('transaction.expenseModal.category')"
      :placeholder="t('transaction.expenseModal.category')"
      @ion-change="categoryId = $event.detail.value"
    >
      <ion-select-option v-for="category in categoryStore.getExpenseCategories()"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </ion-select-option>
    </ion-select>

    <number-input v-model="amount"
      @confirm="confirmModal"
    >
      <ion-input v-model="description"
        type="text"
        :placeholder="t('transaction.expenseModal.description')"
      />
    </number-input>
  </div>
</template>

<style>
ion-modal#expense-modal {
  --border-radius: 16px 16px 0 0;
}
</style>
