<script setup lang="ts">
import {
  IonInput,
  IonSelect,
  IonSelectOption,
  modalController,
} from "@ionic/vue";
import { ModalAction } from "@/modules/modal";
import NumberInput from "../input/number-input.vue";
import { Transaction } from "@/entities/transaction";
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
  const transaction: Transaction = {
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
  <div id="expense-modal">
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

<style scoped>
#expense-modal {
  padding: 16px 32px;
}
</style>

<style>
ion-modal {
  --height: auto;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 0 16px;
}

ion-modal::part(backdrop) {
  background: rgba(209, 213, 219);
  opacity: 1;
}

ion-modal ion-toolbar {
  --background: rgb(14 116 144);
  --color: white;
}
</style>
