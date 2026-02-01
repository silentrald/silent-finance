<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { AmountCount } from "@/dtos/denomination";
import { CreateTransaction } from "@/entities/transaction";
import { CreateTransactionDenomination } from "@/entities/transaction-denomination";
import DenominationInput from "../input/denomination-input.vue";
import DenominationUseCase from "@/use-cases/denomination/types";
import { ModalAction } from "@/modules/modal";
import MyForm from "../input/my-form.vue";
import NumpadInput from "../input/numpad-input.vue";
import SelectInput from "../input/select-input.vue";
import SelectOption from "../input/select-option.vue";
import TextInput from "../input/text-input.vue";
import { TransactionType } from "@/enums/transaction";
import { UseCases } from "@/use-cases/consts";
import { modalController } from "@ionic/vue";
import useCategoryStore from "@/stores/category";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";
import useWalletStore from "@/stores/wallet";

const { walletId } = defineProps<{
  walletId: number;
}>();

const { t } = useLocale();
const toast = useToast();
const categoryStore = useCategoryStore();
const walletStore = useWalletStore();
const denominationUseCase = inject(UseCases.DENOMINATION) as DenominationUseCase;

const amount = ref(0);
const description = ref("");
const categoryId = ref("");
const amountCounts = ref([] as AmountCount[]);
const denominationData = ref({
  amountCount: {},
  total: 0,
} as {
  // id: count
  amountCount: Record<number, AmountCount>;
  total: number;
});

onMounted(async () => {
  if (!walletStore.getWalletById(walletId).hasDenomination) {
    return;
  }

  const result = await denominationUseCase.getAmountCountOfWallet(walletId);
  if (result.isError()) {
    await toast.error({ error: result.getError()! });
    return;
  }

  amountCounts.value = result.getValue();
});

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
      :label="t('transaction.incomeModal.category')"
      :placeholder="t('transaction.incomeModal.category')"
    >
      <select-option v-for="category in categoryStore.getIncomeCategories()"
        :key="category.id"
        :value="category.id.toString()"
      >
        {{ category.name }}
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
        :amount-counts="amountCounts"
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
ion-modal#income-modal {
  --border-radius: 16px 16px 0 0;
}
</style>

