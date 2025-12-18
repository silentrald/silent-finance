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
import useLocale from "@/composables/locale";

const { t } = useLocale();

const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;

const amount = ref("");
const description = ref("");
const categoryId = ref("");
const walletSourceId = ref("");

const categories = ref([] as Category[]);

onMounted(async () => {
  const categoriesResult = await categoryUseCase.getAllCategories();
  if (categoriesResult.isError()) {
    // TODO:
  } else {
    categories.value = categoriesResult.getValue();
  }
});

const confirm = () => {
  console.debug("UwU", categoryId.value);
  const transaction: Transaction = {
    type: TransactionType.EXPENSE,
    amount: +amount.value,
    description: description.value,
    categoryId: +categoryId.value,
    walletSourceId: +walletSourceId.value,
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
      <ion-title>{{ t("category.modal.addCategory") }}</ion-title>
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
        label="amount"
        placeholder="amount"
      />
    </ion-item>
    <ion-item>
      <ion-input v-model="description"
        type="text"
        label-placement="stacked"
        label="description"
        placeholder="description"
      />
    </ion-item>
    <ion-item>
      <ion-select
        label="Category"
        placeholder="Category"
        :value="categories[0]?.id || 1"
        @ionChange="categoryId = $event.detail.value"
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
      <ion-input v-model="walletSourceId"
        type="number"
        label-placement="stacked"
        label="walletSourceId"
        placeholder="walletSourceId"
      />
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
