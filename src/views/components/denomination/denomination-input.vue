<script setup lang="ts">
import { IonInput, IonItem } from "@ionic/vue";
import { inject, onMounted, ref, watch } from "vue";
import { AmountCount } from "@/dtos/denomination";
import { Denomination } from "@/entities/denomination";
import DenominationUseCase from "@/use-cases/denomination/types";
import { UseCases } from "@/use-cases/consts";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const props = defineProps<{
  currencyId: string;
  supportNegative?: boolean;
}>();

const model = defineModel<{
  // id: count
  amountCount: Record<number, AmountCount>;
  total: number;
}>();

const { m } = useLocale();
const toast = useToast();

const denominationUseCase = inject(UseCases.DENOMINATION) as DenominationUseCase;

const denominations = ref([] as Denomination[]);

const loadDenominations = async () => {
  if (!props.currencyId) {
    return;
  }

  // Pre load the denominations
  const denominationsResult = await denominationUseCase
    .getDenominationsByCurrencyId(props.currencyId);
  if (denominationsResult.isError()) {
    await toast.error({ error: denominationsResult.getError()! });
    return;
  }

  denominations.value = denominationsResult.getValue();
  model.value = {
    amountCount: {},
    total: 0,
  }
}

const updateCount = (denomination: Denomination, count: number) => {
  model.value!.total += denomination.amount
    * (count - (model.value!.amountCount[denomination.id]?.count ?? 0));

  if (count === 0) {
    delete model.value!.amountCount[denomination.id];
    return;
  }

  model.value!.amountCount[denomination.id] = {
    amount: denomination.amount,
    count,
  };
}

onMounted(loadDenominations);
watch(() => props.currencyId, loadDenominations);
</script>

<template>
  <!-- TODO: Try to add a "add denomination button" so it would load all denominations currently -->
  <ion-item v-for="denomination in denominations"
    :key="denomination.id"
  >
    <ion-input type="number"
      :min="supportNegative ? undefined : 0"
      :label="m(denomination.amount)"
      value="0"
      @ion-change="updateCount(denomination, +($event.detail.value ?? 0))"
    />
  </ion-item>
  <div v-show="currencyId">Total: {{ m(model!.total) }}</div>
</template>

<style scoped>

</style>
