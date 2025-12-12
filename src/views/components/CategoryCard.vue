<template>
  <div class="category-card"
    :style="{
      backgroundColor: category.color,
    }"
  >
    <div class="category-name">{{ category.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { Category } from '@/entities/category';
import { ref } from 'vue';

const { category: categoryProps, } = defineProps<{
  category: Category;
}>();

const category = ref(categoryProps);
</script>

<style scoped>

</style>
