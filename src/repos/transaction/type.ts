import { CreateTransaction, Transaction } from "@/entities/transaction";
import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export interface TransactionRepo {
  getById(client: DatabaseClient, transactionId: number): PromiseResult<Transaction>;
  getByWalletId(client: DatabaseClient, walletId: number): PromiseResult<Transaction[]>;

  create(client: DatabaseClient, transaction: CreateTransaction): PromiseResult<Transaction>;
  update(client: DatabaseClient, transaction: Transaction): PromiseResult<Transaction>;

  removeById(client: DatabaseClient, transactionId: number): PromiseResult<void>;
}
