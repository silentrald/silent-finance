import { PromiseResult, Result } from "@/types/result";
import { inject, ref } from "vue";
import { Currency } from "@/entities/currency";
import CurrencyUseCase from "@/use-cases/currency/types";
import { UseCases } from "@/use-cases/consts";
import { defineStore } from "pinia";
import logger from "@/modules/logger";

const useCurrencyStore = defineStore("currency", () => {
  const currencies = ref([] as Currency[]);

  const currencyUseCase = inject(UseCases.CURRENCY) as CurrencyUseCase;

  return {
    getCurrencies: () => currencies.value,

    loadCurrencies: async (): PromiseResult<void> => {
      const currenciesResult = await currencyUseCase.getAllCurrencies();
      if (currenciesResult.isError()) return currenciesResult.toError();

      currencies.value = currenciesResult.getValue();
      logger.debug("Initialized currencies");
      return Result.Ok();
    },
  }
});

export default useCurrencyStore;
