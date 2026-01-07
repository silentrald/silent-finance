<script setup lang="ts">
import ColorInput from "../input/color-input.vue";
import { CreateCategory } from "@/entities/category";
import { HexColor } from "@/types";
import { ModalAction } from "@/modules/modal";
import MyForm from "../input/my-form.vue";
import SelectInput from "../input/select-input.vue";
import SelectOption from "../input/select-option.vue";
import TextInput from "../input/text-input.vue";
import { TransactionType } from "@/enums/transaction";
import { modalController } from "@ionic/vue";
import { ref } from "vue";
import useLocale from "@/composables/locale";

const { t } = useLocale();

const name = ref("");
const color = ref("#ffffff" as HexColor);
const type = ref("all" as TransactionType | "all");

const confirm = () => {
  const category: CreateCategory = {
    name: name.value,
    color: color.value,
    type: type.value === "all" ? null : type.value,
  };
  modalController.dismiss(category, ModalAction.CONFIRM);
};

const close = () => modalController.dismiss(null, ModalAction.CLOSE);
</script>

<template>
  <my-form :title="t('category.modal.title')"
    @confirm="confirm"
    @cancel="close"
    @close="close"
  >
    <text-input v-model="name"
      name="name"
      required
      :label="t('category.modal.name')"
      :placeholder="t('category.modal.name')"
    />
    <color-input v-model="color"
      :label="t('category.modal.color')"
    />
    <select-input v-model="type"
      name="type"
      required
      :label="t('category.modal.type')"
      :placeholder="t('category.modal.type')"
    >
      <select-option value="all">{{ t("general.all") }}</select-option>
      <select-option value="E">{{ t("enums.transactionType.E") }}</select-option>
      <select-option value="I">{{ t("enums.transactionType.I") }}</select-option>
      <select-option value="T">{{ t("enums.transactionType.T") }}</select-option>
    </select-input>
  </my-form>
</template>

