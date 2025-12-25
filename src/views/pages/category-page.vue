<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { ModalAction, showModal } from "@/modules/modal";
import { Category } from "@/entities/category";
import CategoryItem from "../components/category/category-item.vue";
import CategoryModal from "../components/category/category-modal.vue";
import SimpleModal from "../components/simple-modal.vue";
import useCategoryStore from "@/stores/category";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const { t } = useLocale();
const toast = useToast();

const categoryStore = useCategoryStore();

const removeCategory = async (category: Category): Promise<void> => {
  const type = category.type
    ? `${t(`enums.transactionType.${category.type!}`)} - `
    : "";
  const modalResult = await showModal(SimpleModal, {
    text: t("category.removeModal", { type, category: category.name }),
  });
  if (modalResult.isError()) {
    await toast.error({
      message: "Could not delete category",
      error: modalResult.getError()!,
    });
  }

  const { action } = modalResult.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  const result = await categoryStore.removeCategory(category.id!);
  if (result.isError()) {
    await toast.error({ error: result.getError()! });
  }
};

const showCreateModal = async () => {
  const modalResult = await showModal<Category>(CategoryModal);
  if (modalResult.isError()) {
    await toast.error({ error: modalResult.getError()! });
    return;
  }

  const { action, data } = modalResult.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  const result = await categoryStore.createCategory(data);
  if (result.isError()) {
    await toast.error({ error: result.getError()! });
  }
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ t("category.title") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t("category.title") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div id="category-container">
          <div v-for="category in categoryStore.getAllCategories()" :key="category.id">
            <category-item :category="category"
              @remove="() => removeCategory(category)"
            />
          </div>
        </div>

        <div id="category-buttons">
          <ion-button id="add-button"
            expand="full"
            fill="clear"
            @click="showCreateModal"
          >
            +
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#category-container {
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  padding: 8px 16px;
}

#category-buttons {
  padding: 0 16px;

  #add-button {
    font-weight: 700;
    font-size: 24px;
    color: white;
    border: 2px dashed white;
    border-radius: 4px;
  }

  #add-button:hover {
    color: black;
    background-color: white;
    border: 2px dashed black;
  }
}
</style>
