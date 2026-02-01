<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { ModalAction, showModal } from "@/modules/modal";
import { add, remove, trash } from "ionicons/icons";
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import { AmountCount } from "@/dtos/denomination";
import { Denomination } from "@/entities/denomination";
import DenominationUseCase from "@/use-cases/denomination/types";
import SelectModal from "../select-modal.vue";
import { UseCases } from "@/use-cases/consts";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const props = withDefaults(defineProps<{
  name: string;
  currencyId: string;
  negative?: boolean;
  amountCounts?: AmountCount[];
}>(), {
  negative: false,
  amountCounts: undefined,
});

const model = defineModel<{
  // denomination id: count
  amountCount: Record<number, AmountCount>;
  total: number;
}>();

const { m } = useLocale();
const toast = useToast();
const setValidation = inject("setValidation") as (key: string, value: boolean) => void;
const removeValidation = inject("removeValidation") as (key: string) => void;

const denominationUseCase = inject(UseCases.DENOMINATION) as DenominationUseCase;

const initialAmountCounts = ref({} as Record<number, AmountCount>);
const denominations = ref([] as Denomination[]);
const showDenominations = ref(new Set<number>());
const amountCountTotal = ref(0);

onMounted(() => {
  setValidation?.(props.name, false);
});

onUnmounted(() => {
  removeValidation?.(props.name);
});

const loadDenominations = async () => {
  if (!props.currencyId) {
    return;
  }

  setValidation?.(props.name, false);

  // Pre load the denominations
  const denominationsResult = await denominationUseCase
    .getDenominationsByCurrencyId(props.currencyId);
  if (denominationsResult.isError()) {
    await toast.error({ error: denominationsResult.getError()! });
    return;
  }

  denominations.value = denominationsResult.getValue();
  const value = {
    amountCount: {},
    total: 0,
  } as {
    amountCount: Record<number, AmountCount>;
    total: number;
  };

  for (const ac of props.amountCounts || []) {
    const denomination = denominations.value.find(d => d.id === ac.id);
    if (!denomination) {
      continue;
    }

    showDenominations.value.add(denomination.id);
    initialAmountCounts.value[denomination.id] = ac;
    // Check if needs to set the difference instead
    amountCountTotal.value = ac.count * ac.amount;
  }

  model.value = value;
}

const hideDenomination = (denomination: Denomination) => {
  updateCount(denomination, 0);
  showDenominations.value.delete(denomination.id);
}

const showDenominationSelectModal = async () => {
  const options: any[] = [];
  const missingDenominations = denominations.value
    .filter(d => !showDenominations.value.has(d.id));
  for (const d of missingDenominations) {
    options.push({
      value: d.id,
      text: `${d.currencyId} ${m(d.amount)}`,
    });
  }

  const result = await showModal<string>(SelectModal, { options });
  if (result.isError()) {
    await toast.error({ error: result.getError()! });
    return;
  }

  const { data: selected, action } = result.getValue();
  if (action !== ModalAction.CONFIRM) {
    return;
  }

  if (!+selected) {
    return;
  }

  showDenominations.value.add(+selected);
}

const getInitialCount = (denominationId: number) => initialAmountCounts.value[denominationId]?.count || 0;
const getCount = (denominationId: number) => model.value?.amountCount[denominationId]?.count || 0;
const getCountLabel = (denominationId: number) => {
  const count = getCount(denominationId);
  if (!props.amountCounts) {
    return count;
  }

  if (count === 0) {
    return getInitialCount(denominationId);
  }

  const sign = count > 0 ? "+" : "-";
  return `${getInitialCount(denominationId)} ${sign} ${Math.abs(count)}`;
}

const updateCount = (denomination: Denomination, count: number) => {
  // limit
  if (initialAmountCounts.value) {
    const initialCount = initialAmountCounts.value[denomination.id]?.count || 0;
    if (initialCount + count < 0) {
      return;
    }
  }

  model.value!.total += denomination.amount
    * (count - (model.value!.amountCount[denomination.id]?.count ?? 0));
  setValidation?.(props.name, model.value!.total * (props.negative ? -1 : 1) > 0);

  if (count === 0) {
    delete model.value!.amountCount[denomination.id];
    return;
  }

  model.value!.amountCount[denomination.id] = {
    id: denomination.id,
    amount: denomination.amount,
    count,
  };
}

onMounted(loadDenominations);
watch(() => props.currencyId, loadDenominations);
watch(() => props.amountCounts, loadDenominations);
</script>

<template>
  <div v-for="denomination in denominations.filter(d => showDenominations.has(d.id))"
    :key="denomination.id"
    class="denomination-row"
  >
    <ion-button @click="() => hideDenomination(denomination)">
      <ion-icon :icon="trash" />
    </ion-button>
    <div class="denomination-amount">
      {{ `${currencyId} ${m(denomination.amount)}` }}
    </div>

    <template v-if="props.negative">
      <ion-button @click="updateCount(denomination, getCount(denomination.id) + 1)">
        <ion-icon :icon="add" />
      </ion-button>
      <div class="denomination-count">
        {{ getCountLabel(denomination.id) }}
      </div>
      <ion-button @click="updateCount(denomination, getCount(denomination.id) - 1)">
        <ion-icon :icon="remove" />
      </ion-button>
    </template>
    <template v-else>
      <ion-button @click="updateCount(denomination, getCount(denomination.id) - 1)">
        <ion-icon :icon="remove" />
      </ion-button>
      <div class="denomination-count">
        {{ getCountLabel(denomination.id) }}
      </div>
      <ion-button @click="updateCount(denomination, getCount(denomination.id) + 1)">
        <ion-icon :icon="add" />
      </ion-button>
    </template>
  </div>

  <ion-button @click="showDenominationSelectModal">
    Add Denomination
  </ion-button>

  <div v-show="currencyId"
    class="denomination-total ion-padding"
  >
    <b>Total:</b> {{ currencyId }} {{ m(model!.total) }}
  </div>
</template>

<style scoped>
.denomination-row {
  display: flex;
  align-items: center;
  padding: 2px 4px;
  gap: 4px;

  .denomination-amount {
    flex: 3;
  }

  .denomination-count {
    flex: 1;
    text-align: center;
  }
}

.denomination-total {
  text-align: right;
}
</style>
