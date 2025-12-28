import { Currency } from "@/entities/currency";
import { PromiseResult } from "@/types/result";

export default interface CurrencyUseCase {
  getAllCurrencies(): PromiseResult<Currency[]>;
}
