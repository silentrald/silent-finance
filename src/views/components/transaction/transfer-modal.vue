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
import { inject, onMounted, ref } from "vue";
import { Category } from "@/entities/category";
import CategoryUseCase from "@/use-cases/category/types";
import { ModalAction } from "@/modules/modal";
import { Transaction } from "@/entities/transaction";
import { TransactionType } from "@/enums/transaction";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import WalletUseCase from "@/use-cases/wallet/types";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const { walletId } = defineProps<{
  walletId: number;
}>();

const { t } = useLocale();
const toast = useToast();

const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;
const walletUseCase = inject(UseCases.WALLET) as WalletUseCase;

const amount = ref("");
const description = ref("");
const categoryId = ref("");
const destinationWalletId = ref("");

const categories = ref([] as Category[]);
const wallets = ref([] as Wallet[]);

onMounted(async () => {
  const categoriesResult = await categoryUseCase.getAllCategories();
  if (categoriesResult.isError()) {
    await toast.error({ error: categoriesResult.getError()! });
    modalController.dismiss(null, ModalAction.ERROR);
    return;
  }

  const walletsResult = await walletUseCase.getAllWallets();
  if (walletsResult.isError()) {
    await toast.error({ error: walletsResult.getError()! });
    modalController.dismiss(null, ModalAction.ERROR);
    return;
  }

  categories.value = categoriesResult.getValue();
  categoryId.value = categoriesResult.getValue()[0].id!.toString();

  const _wallets = walletsResult.getValue()
    .filter(w => w.id !== walletId);
  wallets.value = _wallets;
  destinationWalletId.value = _wallets[0].id!.toString();
});

const confirm = () => {
  const transaction: Transaction = {
    type: TransactionType.EXPENSE,
    amount: +amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: walletId,
    walletDestinationId: +destinationWalletId.value,
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
      <ion-title>{{ t("transaction.transferModal.title") }}</ion-title>
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
        :label="t('transaction.transferModal.amount')"
        :placeholder="t('transaction.transferModal.amount')"
      />
    </ion-item>
    <ion-item>
      <ion-input v-model="description"
        type="text"
        label-placement="stacked"
        :label="t('transaction.transferModal.description')"
        :placeholder="t('transaction.transferModal.description')"
      />
    </ion-item>
    <ion-item>
      <ion-select
        :label="t('transaction.transferModal.category')"
        :placeholder="t('transaction.transferModal.category')"
        @ion-change="categoryId = $event.detail.value"
      >
        <ion-select-option v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-select
        :label="t('transaction.transferModal.destinationWallet')"
        :placeholder="t('transaction.transferModal.destinationWallet')"
        @ion-change="categoryId = $event.detail.value"
      >
        <ion-select-option v-for="wallet in wallets"
          :key="wallet.id"
          :value="wallet.id"
        >
          {{ wallet.name }}
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
