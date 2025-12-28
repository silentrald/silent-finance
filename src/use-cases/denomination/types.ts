import { AmountCount } from "@/dtos/denomination";
import { Denomination } from "@/entities/denomination";
import { PromiseResult } from "@/types/result";

export default interface DenominationUseCase {
  getDenominationsByCurrencyId(currencyId: string): PromiseResult<Denomination[]>;

  getAmountCountOfWallet(walletId: number): PromiseResult<AmountCount[]>;
  // getAmountCountOfTransaction(transactionId: number): PromiseResult<AmountCount[]>;
}
