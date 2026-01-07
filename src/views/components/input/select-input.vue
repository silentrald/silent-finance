<script setup lang="ts">
import { IonItem, IonSelect } from "@ionic/vue";
import { inject, onMounted, onUnmounted, ref } from "vue";
import useLocale from "@/composables/locale";

const props = defineProps<{
  name: string;
  label: string;
  modelValue: string;
  placeholder?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [ string ];
}>();

const { t } = useLocale();
const setValidation = inject("setValidation") as (key: string, value: boolean) => void;
const removeValidation = inject("removeValidation") as (key: string) => void;

const isValid = ref(!props.required);
const isTouched = ref(false);
const errorText = ref("");

onMounted(() => {
  setValidation?.(props.name, isValid.value);
});

onUnmounted(() => {
  removeValidation?.(props.name);
});

const getLabel = () => {
  return props.required ? props.label + "*" : props.label;
}

const onChange = (event: any) => {
  const value = event.detail.value || "" as string;
  emit("update:modelValue", event.detail.value);

  if (props.required && !value) {
    errorText.value = t("inputs.required", { field: props.label });
    setValidation?.(props.name, false);
    return;
  }

  errorText.value = "";
  setValidation?.(props.name, true);
}

const onBlur = () => {
  isTouched.value = true;
}
</script>

<template>
  <ion-item>
    <ion-select :name="props.name"
      :label="getLabel()"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :class="{
        'ion-valid': isValid,
        'ion-invalid': isValid === false,
        'ion-touch': isTouched,
      }"
      :error-text="errorText"
      @ion-change="onChange"
      @ion-blur="onBlur"
    >
      <slot />
    </ion-select>
  </ion-item>
</template>
