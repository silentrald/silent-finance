import { PromiseResult, Result } from "@/types/result";
import { DatabaseService } from "@/types/database";
import { Transaction } from "@/entities/transaction";
import { TransactionRepo } from "./type";

export default function createSQLite3TransactionRepo({
  databaseService,
}: {
  databaseService: DatabaseService
}): TransactionRepo {
  return {
    getByWalletId: async (walletId): PromiseResult<Transaction[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        // TODO:
        return Result.Ok([] as Transaction[]);
      } finally {
        await client.close();
      }
    },

    create: async (transaction): PromiseResult<Transaction> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        // TODO:
        return Result.Ok(transaction);
      } finally {
        await client.close();
      }
    },

    update: async (transaction): PromiseResult<Transaction> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        // TODO:
        return Result.Ok(transaction);
      } finally {
        await client.close();
      }
    },

    removeById: async (transactionId): PromiseResult<void> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        // TODO:
        return Result.Ok();
      } finally {
        await client.close();
      }
    },
  }
}

