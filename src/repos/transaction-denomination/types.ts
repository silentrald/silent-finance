import { CreateTransactionDenomination, TransactionDenomination } from "@/entities/transaction-denomination";
import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export interface TransactionDenominationRepo {
  getByTransactionId(
    client: DatabaseClient,
    transactionId: number
  ): PromiseResult<TransactionDenomination[]>;

  createList(
    client: DatabaseClient,
    transactionId: number,
    transactionDenominations: CreateTransactionDenomination[]
  ): PromiseResult<TransactionDenomination[]>;

  removeByTransactionId(
    client: DatabaseClient,
    transactionId: number
  ): PromiseResult<void>;
}
