<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonHeader,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { AmountCount } from "@/dtos/denomination";
import ColorInput from "../input/color-input.vue";
import { CreateWallet } from "@/entities/wallet";
import { CreateWalletDenomination } from "@/entities/wallet-denomination";
import DenominationInput from "../denomination/denomination-input.vue";
import { HexColor } from "@/types";
import { ModalAction } from "@/modules/modal";
import { ref } from "vue";
import useCurrencyStore from "@/stores/currency";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const currencyStore = useCurrencyStore();

const name = ref("");
const amount = ref("");
const color = ref("#ffffff" as HexColor);
const currencyId = ref("");
const hasDenomination = ref(false);
const denominationData = ref({
  amountCount: {},
  total: 0,
} as {
  // id: count
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
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="close">{{ t("general.close") }}</ion-button>
      </ion-buttons>
      <ion-title>{{ t("transaction.walletModal.title") }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm" :strong="true">{{ t("general.confirm") }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-item>
    <ion-input v-model="name"
      type="text"
      label-placement="stacked"
      :label="t('transaction.walletModal.name')"
      :placeholder="t('transaction.walletModal.name')"
    />
  </ion-item>

  <ion-item>
    <color-input v-model="color"
      :label="t('transaction.walletModal.color')"
    />
  </ion-item>

  <ion-item>
    <ion-select
      label="Currency"
      placeholder="Currency"
      @ion-change="currencyId = $event.detail.value"
    >
      <ion-select-option v-for="currency in currencyStore.getCurrencies()"
        :key="currency.id"
        :value="currency.id"
      >
        {{ currency.id }} ({{ currency.unicode }})
      </ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-checkbox v-model="hasDenomination"
      label-placement="start"
    >
      Has Denomination?
    </ion-checkbox>
  </ion-item>

  <template v-if="hasDenomination">
    <denomination-input v-model="denominationData"
      :currency-id="currencyId"
    />
  </template>
  <template v-else>
    <ion-item>
      <ion-input v-model="amount"
        type="number"
        label-placement="stacked"
        :label="t('transaction.walletModal.amount')"
        :placeholder="t('transaction.walletModal.amount')"
      />
    </ion-item>
  </template>
</template>

