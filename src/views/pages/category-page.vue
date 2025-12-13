<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { inject, onMounted, ref } from 'vue';
import { Category } from '@/entities/category';
import CategoryCard from '../components/category/category-card.vue';
import { CategoryRepo } from '@/repos/category/type';
import { Repos } from '@/repos/consts';
import logger from '@/modules/logger';
import useLocale from '@/composables/locale';

const { t } = useLocale();

const categoryRepo: CategoryRepo | undefined = inject(Repos.CATEGORY);
const categories = ref([] as Category[]);
const newCategory = ref({
  name: "",
  color: "",
  icon: "",
});

onMounted(async () => {
  if (!categoryRepo) {
    return;
  }

  categories.value = (await categoryRepo.getAll()).getValue();
});

async function createCategory() {
  if (!categoryRepo) {
    return;
  }

  const result = await categoryRepo.create({
    name: newCategory.value.name,
    color: newCategory.value.color,
    icon: newCategory.value.icon,
  });
  if (result.isError()) {
    logger.error("Could not add category", result.getError());
    return;
  }

  categories.value = (await categoryRepo.getAll()).getValue();
}
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
          <category-card :category="category"
            @remove="console.debug('UwU')"
          />
        </div>
        </div>

        <div>
          <input type="text" v-model="newCategory.name" placeholder="name" />
          <input type="text" v-model="newCategory.color" placeholder="color" />
          <ion-button @click="createCategory">
            {{ t("category.createCategory") }}
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
</style>
