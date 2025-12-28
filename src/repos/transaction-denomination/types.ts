import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";
import { TransactionDenomination } from "@/entities/transaction-denomination";

export interface TransactionDenominationRepo {
  getByTransactionId(
    client: DatabaseClient,
    transactionId: number
  ): PromiseResult<TransactionDenomination[]>;

  createList(
    client: DatabaseClient,
    transactionDenominations: TransactionDenomination[]
  ): PromiseResult<TransactionDenomination[]>;

  removeByTransactionId(
    client: DatabaseClient,
    transactionId: number
  ): PromiseResult<void>;
}
