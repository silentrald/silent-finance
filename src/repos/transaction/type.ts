import { PromiseResult } from "@/types/result";
import { Transaction } from "@/entities/transaction";

export interface TransactionRepo {
  getByWalletId(walletId: number): PromiseResult<Transaction[]>;

  create(transaction: Transaction): PromiseResult<Transaction>;
  update(transaction: Transaction): PromiseResult<Transaction>;

  removeById(transactionId: number): PromiseResult<void>;
}
