import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";
import { Transaction } from "@/entities/transaction";

export interface TransactionRepo {
  getByWalletId(client: DatabaseClient, walletId: number): PromiseResult<Transaction[]>;

  create(client: DatabaseClient, transaction: Transaction): PromiseResult<Transaction>;
  update(client: DatabaseClient, transaction: Transaction): PromiseResult<Transaction>;

  removeById(client: DatabaseClient, transactionId: number): PromiseResult<void>;
}
