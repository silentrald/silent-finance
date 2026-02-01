<script setup lang="ts">
import {
  IonCheckbox,
  IonItem,
  modalController,
} from "@ionic/vue";
import { AmountCount } from "@/dtos/denomination";
import ColorInput from "../input/color-input.vue";
import { CreateWallet } from "@/entities/wallet";
import { CreateWalletDenomination } from "@/entities/wallet-denomination";
import DenominationInput from "../input/denomination-input.vue";
import { HexColor } from "@/types";
import { ModalAction } from "@/modules/modal";
import MyForm from "../input/my-form.vue";
import NumberInput from "../input/number-input.vue";
import SelectInput from "../input/select-input.vue";
import SelectOption from "../input/select-option.vue";
import TextInput from "../input/text-input.vue";
import { ref } from "vue";
import useCurrencyStore from "@/stores/currency";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const currencyStore = useCurrencyStore();

const name = ref("");
const amount = ref(0);
const color = ref("#ffffff" as HexColor);
const currencyId = ref("");
const hasDenomination = ref(false);
const denominationData = ref({
  amountCount: {},
  total: 0,
} as {
  // denomination id: count
  amountCount: Record<number, AmountCount>;
  total: number;
})

const confirm = () => {
  let denominations: CreateWalletDenomination[] | null = null;
  if (hasDenomination.value) {
    denominations = [];
    for (const key in denominationData.value.amountCount) {
      denominations.push({
        denominationId: +key,
        count: denominationData.value.amountCount[key].count,
      })
    }
  }

  const wallet: CreateWallet = {
    name: name.value,
    amount: +amount.value, // Gets recalc'ed when denominations has value
    color: color.value as HexColor,
    currencyId: currencyId.value,
    denominations,
  };
  modalController.dismiss(wallet, ModalAction.CONFIRM);
};

const close = () => modalController.dismiss(null, ModalAction.CLOSE);
</script>

<template>
  <my-form :title="t('transaction.walletModal.title')"
    @confirm="confirm"
    @cancel="close"
    @close="close"
  >
    <text-input v-model="name"
      name="name"
      required
      :label="t('transaction.walletModal.name')"
      :placeholder="t('transaction.walletModal.name')"
      :validate="() => ''"
    />

    <color-input v-model="color"
      required
      :label="t('transaction.walletModal.color')"
    />

    <select-input v-model="currencyId"
      name="currency"
      label="Currency"
      placeholder="Currency"
      required
    >
      <select-option v-for="currency in currencyStore.getCurrencies()"
        :key="currency.id"
        :value="currency.id"
      >
        {{ currency.id }} ({{ currency.unicode }})
      </select-option>
    </select-input>

    <ion-item>
      <ion-checkbox v-model="hasDenomination"
        label-placement="start"
      >
        Has Denomination?
      </ion-checkbox>
    </ion-item>

    <template v-if="hasDenomination">
      <denomination-input v-model="denominationData"
        name="denomination"
        :currency-id="currencyId"
      />
    </template>
    <template v-else>
      <number-input v-model="amount"
        name="amount"
        required
        :label="t('transaction.walletModal.amount')"
        :placeholder="t('transaction.walletModal.amount')"
      />
    </template>
  </my-form>
</template>

