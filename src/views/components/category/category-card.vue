<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { Category } from "@/entities/category";
import { closeOutline } from "ionicons/icons";
import { ref } from "vue";

const { category: categoryProps } = defineProps<{
  category: Category;
}>();
const emit = defineEmits<{
  remove: [];
}>();

const category = ref(categoryProps);
</script>

<template>
  <div class="category-card"
    :style="{
      backgroundColor: category.color,
    }"
  >
    <img class="category-icon"
      :src="category.icon || '/images/help-outline.png'"
      alt=""
    />
    <div class="category-name">{{ category.name }}</div>
    <ion-button class="category-remove"
      fill="clear"
      @click="emit('remove')"
    >
      <ion-icon class="category-remove-icon"
        slot="icon-only"
        :icon="closeOutline"
        color="light"
      />
    </ion-button>
  </div>
</template>

<style scoped>
.category-card {
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 8px;

  border-radius: 4px;

  .category-icon {
    width: 40px;
    height: 40px;
    padding: 4px;
    border: 2px solid black;
    border-radius: 4px;
  }

  .category-name {
    color: black;
    font-weight: 700;
    text-overflow: ellipsis;
  }

  .category-remove {
    margin-left: auto;

    .category-remove-icon {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
