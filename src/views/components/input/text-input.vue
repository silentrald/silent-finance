<script setup lang="ts">
import { IonInput, IonItem } from "@ionic/vue";
import { inject, onMounted, onUnmounted, ref } from "vue";
import useLocale from "@/composables/locale";

const props = defineProps<{
  label: string;
  name: string;
  modelValue: string;
  required?: boolean;
  placeholder?: string;
  // return the error text to be shown if invalid
  //   else, return an empty string ""
  validate?: (value: string) => string;
}>();

const emit = defineEmits<{
  "update:modelValue": [ string ];
}>();

const { t } = useLocale();
const setValidation = inject("setValidation") as (key: string, value: boolean) => void;
const removeValidation = inject("removeValidation") as (key: string) => void;

const input = ref();
const isTouched = ref(false);
const errorText = ref("");

onMounted(() => {
  setValidation?.(props.name, !props.required);
});

onUnmounted(() => {
  removeValidation?.(props.name);
});

const getLabel = () => {
  return props.required ? props.label + "*" : props.label;
}

const validate = (value: string): string => {
  if (!value) {
    return props.required
      ? t("inputs.required", { field: props.label })
      : "";
  }

  return props.validate?.(value) || "";
}

const onInput = (event: any) => {
  const value = event.detail.value || "" as string;
  emit("update:modelValue", value);

  errorText.value = "";
  input.value.$el.classList.remove("ion-valid", "ion-invalid");

  const error = validate(value);
  if (error) {
    setValidation?.(props.name, false);
    input.value.$el.classList.add("ion-invalid");
    errorText.value = error;
  } else {
    setValidation?.(props.name, true);
    input.value.$el.classList.add("ion-valid");
  }
}

const onBlur = () => {
  isTouched.value = true;
  input.value.$el.classList.add("ion-touched");
}
</script>

<template>
  <ion-item>
    <ion-input ref="input"
      label-placement="stacked"
      type="text"
      :name="props.name"
      :label="getLabel()"
      :placeholder="props.placeholder"
      :error-text="isTouched ? errorText : ''"
      @ion-input="onInput"
      @ion-blur="onBlur"
    />
  </ion-item>
</template>
