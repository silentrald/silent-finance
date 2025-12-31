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
const destinationWalletId = ref("");

const confirmModal = () => {
  const transaction: CreateTransaction = {
    type: TransactionType.EXPENSE,
    amount: amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: walletId,
    walletDestinationId: +destinationWalletId.value,
  };
  modalController.dismiss(transaction, ModalAction.CONFIRM);
};
</script>

<template>
  <div class="ion-padding">
    <ion-select
      :label="t('transaction.transferModal.category')"
      @ion-change="categoryId = $event.detail.value"
    >
      <ion-select-option v-for="category in categoryStore.getTransferCategories()"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </ion-select-option>
    </ion-select>
    <ion-select
      :label="t('transaction.transferModal.destinationWallet')"
      @ion-change="destinationWalletId = $event.detail.value"
    >
      <ion-select-option
        v-for="wallet in walletStore.getWallets().filter(w => w.id !== walletId)"
        :key="wallet.id"
        :value="wallet.id"
      >
        {{ wallet.name }}
      </ion-select-option>
    </ion-select>

    <number-input v-model="amount"
      @confirm="confirmModal"
    >
      <ion-input v-model="description"
        type="text"
        :placeholder="t('transaction.transferModal.description')"
      />
    </number-input>
  </div>
</template>

<style>
ion-modal#transfer-modal {
  --border-radius: 16px 16px 0 0;
}
</style>
