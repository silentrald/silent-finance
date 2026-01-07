<script setup lang="ts">
import { AmountCount } from "@/dtos/denomination";
import { CreateTransaction } from "@/entities/transaction";
import { CreateTransactionDenomination } from "@/entities/transaction-denomination";
import DenominationInput from "../input/denomination-input.vue";
import { ModalAction } from "@/modules/modal";
import MyForm from "../input/my-form.vue";
import NumpadInput from "../input/numpad-input.vue";
import SelectInput from "../input/select-input.vue";
import SelectOption from "../input/select-option.vue";
import TextInput from "../input/text-input.vue";
import { TransactionType } from "@/enums/transaction";
import { modalController } from "@ionic/vue";
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
const denominationData = ref({
  amountCount: {},
  total: 0,
} as {
  // id = count
  amountCount: Record<number, AmountCount>;
  total: number;
})

const getCurrencyId = () => walletStore.getWalletById(walletId).currencyId;
const hasDenomination = () => walletStore.getWalletById(walletId).hasDenomination;

// === Events === //

const onConfirm = () => {
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
    amount: hasDenomination() ? null : amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: walletId,
    walletDestinationId: +destinationWalletId.value,
    denominations,
  };
  modalController.dismiss(transaction, ModalAction.CONFIRM);
};

const onClose = () => {
  modalController.dismiss(null, ModalAction.CLOSE);
}
</script>

<template>
  <my-form class="ion-padding"
    :hide-buttons="!hasDenomination()"
    @confirm="onConfirm"
    @cancel="onClose"
    @close="onClose"
  >
    <select-input v-model="categoryId"
      name="category"
      required
      :label="t('transaction.transferModal.category')"
    >
      <select-option v-for="category in categoryStore.getTransferCategories()"
        :key="category.id"
        :value="category.id.toString()"
      >
        {{ category.name }}
      </select-option>
    </select-input>
    <select-input v-model="destinationWalletId"
      name="destinationWallet"
      required
      :label="t('transaction.transferModal.destinationWallet')"
    >
      <select-option
        v-for="wallet in walletStore.getWallets().filter(w => w.id !== walletId)"
        :key="wallet.id"
        :value="wallet.id.toString()"
      >
        {{ wallet.name }}
      </select-option>
    </select-input>

    <template v-if="hasDenomination()">
      <text-input v-model="description"
        name="description"
        :placeholder="t('transaction.expenseModal.description')"
      />
      <denomination-input v-model="denominationData"
        name="denomination"
        :currency-id="getCurrencyId()"
        support-negative
      />
    </template>
    <template v-else>
      <numpad-input v-model="amount"
        @confirm="onConfirm"
      >
        <text-input v-model="description"
          name="description"
          :placeholder="t('transaction.expenseModal.description')"
        />
      </numpad-input>
    </template>
  </my-form>
</template>

<style>
ion-modal#transfer-modal {
  --border-radius: 16px 16px 0 0;
}
</style>
