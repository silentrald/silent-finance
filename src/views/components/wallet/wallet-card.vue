<script setup lang="ts">
import { IonButton, IonIcon, IonPopover } from "@ionic/vue";
import { inject, ref, watch } from "vue";
import { AmountCount } from "@/dtos/denomination";
import DenominationUseCase from "@/use-cases/denomination/types";
import { UseCases } from "@/use-cases/consts";
import { Wallet } from "@/entities/wallet";
import { trash } from "ionicons/icons";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const props = defineProps<{
  wallet: Wallet;
}>();
const emit = defineEmits<{
  remove: [];
}>();

const denominationUseCase = inject(UseCases.DENOMINATION) as DenominationUseCase;

const { m } = useLocale();
const toast = useToast();

const wallet = ref(props.wallet);
const showDenominations = ref(false);
const denominations = ref(null as AmountCount[] | null);

watch(() => props.wallet, () => wallet.value = props.wallet);

watch(() => showDenominations.value, async () => {
  if (!showDenominations.value) {
    return;
  }

  const result = await denominationUseCase.getAmountCountOfWallet(props.wallet.id);
  if (result.isError()) {
    await toast.error({ error: result.getError()! });
    return;
  }

  denominations.value = result.getValue();
})
</script>

<template>
  <div class="wallet-card ion-padding"
    :style="{
      backgroundColor: wallet.color,
    }"
    @click="showDenominations = !showDenominations"
  >
    <div class="wallet-name">{{ wallet.name }}</div>
    <div class="wallet-amount">
      {{ wallet.currencyId }}
      {{ m(wallet.amount) }}
    </div>

    <!-- TODO: Create a proper way for deleting this -->
    <div class="wallet-remove">
      <ion-button fill="clear"
        @click="emit('remove')"
        color="light"
      >
        <ion-icon :icon="trash" />
      </ion-button>
    </div>
  </div>

  <!-- TODO: Temporary -->
  <ion-popover :is-open="showDenominations">
    <table>
      <tbody>
        <tr>
          <th>Amount</th>
          <th>Count</th>
        </tr>

        <tr v-for="denomination in denominations"
          :key="denomination.amount"
        >
          <td>{{ wallet.currencyId }} {{ m(denomination.amount) }}</td>
          <td>{{ denomination.count }}</td>
        </tr>
      </tbody>
    </table>
  </ion-popover>
</template>

<style scoped>
.wallet-card {
  display: grid;

  border-radius: 4px;
  color: black;

  aspect-ratio: 1.6;
  min-width: 300px;
  max-width: 600px;

  .wallet-name {
    grid-row: 1;
    grid-column: 1;

    text-align: start;
    font-weight: 700;
    text-overflow: ellipsis;
  }

  .wallet-amount {
    grid-row: 2;
    grid-column: 1 / span 2;

    display: flex;
    justify-content: end;
    align-items: end;

    font-weight: 700;
  }

  .wallet-remove {
    grid-row: 1;
    grid-column: 2;

    margin-left: auto;
  }
}
</style>
