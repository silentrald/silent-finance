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
import { inject, onMounted, ref } from "vue";
import { Category } from "@/entities/category";
import CategoryItem from "../components/category/category-item.vue";
import CategoryModal from "../components/category/category-modal.vue";
import CategoryUseCase from "@/use-cases/category/types";
import { UseCases } from "@/use-cases/consts";
import logger from "@/modules/logger";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;
const categories = ref([] as Category[]);

onMounted(async () => {
  const categoriesResult = await categoryUseCase.getAllCategories();
  if (categoriesResult.isError()) {
    logger.error("Could not get categories", categoriesResult.getError());
    return;
  }

  categories.value = categoriesResult.getValue();
});

const removeCategory = async (categoryId: number): Promise<void> => {
  const result = await categoryUseCase.removeCategory(categoryId);
  if (result.isError()) {
    logger.error("Could not delete category", result.getError());
    return;
  }

  const index = categories.value.findIndex(c => c.id === categoryId);
  if (index > -1) {
    categories.value.splice(index, 1);
  }
};

const showCreateModal = async () => {
  const modalResult = await showModal<Category>(CategoryModal);
  if (modalResult.isError()) {
    logger.error("Could not open modal", modalResult.getError());
    return;
  }

  const { action, data } = modalResult.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  const result = await categoryUseCase.createCategory(data);
  if (result.isError()) {
    logger.error("Could not create category", result.getError());
    return;
  }

  categories.value.push(result.getValue());
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
          <div v-for="category in categories" :key="category.id">
            <category-item :category="category"
              @remove="() => removeCategory(category.id!)"
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
