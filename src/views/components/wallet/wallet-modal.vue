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
import { inject, ref, watch } from "vue";
import ColorInput from "../input/color-input.vue";
import { CreateWallet } from "@/entities/wallet";
import { CreateWalletDenomination } from "@/entities/wallet-denomination";
import { Denomination } from "@/entities/denomination";
import DenominationUseCase from "@/use-cases/denomination/types";
import { HexColor } from "@/types";
import { ModalAction } from "@/modules/modal";
import { UseCases } from "@/use-cases/consts";
import useCurrencyStore from "@/stores/currency";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const { t, m } = useLocale();
const toast = useToast();

const currencyStore = useCurrencyStore();

const name = ref("");
const amount = ref("");
const color = ref("#ffffff");
const currencyId = ref("");
const hasDenomination = ref(false);

const {
  denominations, walletDenominations, total,
  updateCount,
} = (() => {
  const denominationUseCase = inject(UseCases.DENOMINATION) as DenominationUseCase;

  const cachedId = ref("");
  const denominations = ref([] as Denomination[]);
  // id: count
  const walletDenominations = ref({} as Record<number, CreateWalletDenomination>);
  const total = ref(0);

  const loadDenominations = async () => {
    walletDenominations.value = {};
    total.value = 0;

    if (!hasDenomination.value || cachedId.value === currencyId.value) {
      return;
    }

    const denominationsResult = await denominationUseCase
      .getDenominationsByCurrencyId(currencyId.value);
    if (denominationsResult.isError()) {
      await toast.error({ error: denominationsResult.getError()! });
      return;
    }

    cachedId.value = currencyId.value;
    denominations.value = denominationsResult.getValue();
  };

  watch(() => currencyId.value, loadDenominations);
  watch(() => hasDenomination.value, loadDenominations);

  return {
    denominations, walletDenominations, total,

    updateCount: (denomination: Denomination, count: number) => {
      count = Math.max(0, count);

      total.value += denomination.amount
        * (count - (walletDenominations.value[denomination.id!]?.count ?? 0));
      walletDenominations.value[denomination.id!] = {
        denominationId: denomination.id!,
        count,
      };
    },
  };
})();

const confirm = () => {
  const wallet: CreateWallet = {
    name: name.value,
    amount: +amount.value,
    color: color.value as HexColor,
    currencyId: currencyId.value,
    denominations: hasDenomination.value
      ? Object.values(walletDenominations.value)
      : null,
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
    <!-- TODO: Try to add a "add denomination button" so it would load all denominations currently -->
    <ion-item v-for="denomination in denominations"
      :key="denomination.id"
    >
      <ion-input type="number"
        :label="m(denomination.amount)"
        value="0"
        @ion-change="updateCount(denomination, +($event.detail.value ?? 0))"
      />
    </ion-item>
    <div v-show="currencyId">Total: {{ m(total) }}</div>
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

