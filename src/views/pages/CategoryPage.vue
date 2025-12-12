<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Categories</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Categories</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div v-for="category in categories" :key="category.id">
          <category-card :category="category" />
        </div>

        <div>
          <input type="text" v-model="newCategory.name" placeholder="name" />
          <input type="text" v-model="newCategory.color" placeholder="color" />
          <button @click="createCategory">
            Create Category
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { inject, onMounted, ref } from 'vue';
import { Category } from '@/entities/category';
import CategoryCard from '../components/CategoryCard.vue';
import { CategoryRepo } from '@/repos/category/type';
import { Repos } from '@/repos/consts';

const categoryRepo: CategoryRepo | undefined = inject(Repos.CATEGORY);
const categories = ref([] as Category[]);
const newCategory = ref({
  name: "",
  color: "",
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

  await categoryRepo.create({
    name: newCategory.value.name,
    color: newCategory.value.color,
  });

  categories.value = (await categoryRepo.getAll()).getValue();
}
</script>
