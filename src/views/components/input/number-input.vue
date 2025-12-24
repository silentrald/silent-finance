<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { backspaceOutline, checkmark } from "ionicons/icons";
import { ref } from "vue";
import useLocale from "@/composables/locale";

enum State {
  WHOLE,
  TENTHS,
  HUNDREDTHS,
  END,
}

defineEmits<{
  confirm: [];
}>();

const { n } = useLocale();

const value = defineModel<number>({ required: true });
const whole = ref(Math.trunc(value.value / 100));
const decimal = ref(value.value % 100);
const state = ref(State.WHOLE);
const label = ref(`${whole.value}.${decimal.value.toString().padStart(2, "0")}`);

const updateValue = () => {
  value.value = whole.value * 100 + decimal.value;
  label.value = `${n(whole.value)}.${decimal.value.toString().padStart(2, "0")}`;
};

const onNumberClicked = (num: number): void => {
  switch (state.value) {
  case State.WHOLE:
    whole.value = whole.value * 10 + num;
    break;

  case State.TENTHS:
    decimal.value = num * 10;
    state.value = State.HUNDREDTHS;
    break;

  case State.HUNDREDTHS:
    decimal.value += num;
    state.value = State.END;
    break;
  }

  updateValue();
}

const onDotClicked = (): void => {
  if (state.value === State.WHOLE) {
    state.value = State.TENTHS;
  }
}

const onBackspaceClicked = (): void => {
  switch (state.value) {
  case State.WHOLE:
    whole.value = Math.trunc(whole.value / 10);
    break;

  case State.TENTHS:
    state.value = State.WHOLE;
    break;

  case State.HUNDREDTHS:
    decimal.value = 0;
    state.value = State.TENTHS
    break;

  case State.END:
    decimal.value -= decimal.value % 10;
    state.value = State.HUNDREDTHS;
    break;
  }

  updateValue();
}
</script>

<template>
  <div class="numpad-input">
    <div id="amount-label">{{ label }}</div>

    <slot/>

    <div class="numpad-buttons">
      <!-- Numbers -->
      <ion-button v-for="num in 9"
        :key="num"
        class="numpad-button"
        fill="clear"
        :style="{
          gridRow: Math.ceil(num / 3),
          gridColumn: num % 3,
        }"
        @click="() => onNumberClicked(num)"
      >
        {{ num }}
      </ion-button>
      <ion-button class="numpad-button"
        fill="clear"
        :style="{
          gridRow: 4,
          gridColumn: 2,
        }"
        @click="() => onNumberClicked(0)"
      >
        0
      </ion-button>

      <!-- Miscelaneous -->
      <ion-button class="numpad-button"
        fill="clear"
        :style="{
          gridRow: 4,
          gridColumn: 3,
        }"
        @click="() => onDotClicked()"
      >
        .
      </ion-button>
      <ion-button class="numpad-button"
        fill="clear"
        :style="{
          gridRow: 1,
          gridColumn: 4,
        }"
        @click="() => onBackspaceClicked()"
      >
        <ion-icon slot="icon-only" :icon="backspaceOutline" />
      </ion-button>

      <ion-button id="confirm-button"
        class="numpad-button"
        fill="clear"
        :style="{
          gridRow: '2 / span 3',
          gridColumn: 4,
        }"
        @click="$emit('confirm')"
      >
        <ion-icon slot="icon-only" :icon="checkmark" />
      </ion-button>
    </div>
  </div>
</template>

<style scoped>
#amount-label {
  text-align: center;
  font-size: 48px;
  font-weight: 700;
}

.numpad-input {

  .numpad-buttons {
    display: grid;

    .numpad-button {
      color: white;
      font-weight: 700;
      font-size: 24px;
    }

    #confirm-button {
      background-color: green;
    }
  }
}
</style>
