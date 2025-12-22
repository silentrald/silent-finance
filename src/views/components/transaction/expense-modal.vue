<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { ModalAction } from "@/modules/modal";
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

const amount = ref("");
const description = ref("");
const categoryId = ref("");

const confirm = () => {
  const transaction: Transaction = {
    type: TransactionType.EXPENSE,
    amount: +amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: walletId,
  };
  modalController.dismiss(transaction, ModalAction.CONFIRM);
};

const close = () => modalController.dismiss(null, ModalAction.CLOSE);
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="close">{{ t("general.close") }}</ion-button>
      </ion-buttons>
      <ion-title>{{ t("transaction.expenseModal.title") }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm" :strong="true">{{ t("general.confirm") }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-item>
      <ion-input v-model="amount"
        type="number"
        label-placement="stacked"
        :label="t('transaction.expenseModal.amount')"
        :placeholder="t('transaction.expenseModal.amount')"
      />
    </ion-item>
    <ion-item>
      <ion-input v-model="description"
        type="text"
        label-placement="stacked"
        :label="t('transaction.expenseModal.description')"
        :placeholder="t('transaction.expenseModal.description')"
      />
    </ion-item>
    <ion-item>
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
    </ion-item>
  </ion-content>
</template>

<style>
ion-modal {
  --height: 50%;
  --border-radius: 16px;
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
