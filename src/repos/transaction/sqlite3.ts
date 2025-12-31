import { PromiseResult, Result } from "@/types/result";
import { Tables } from "@/db/consts";
import { Transaction } from "@/entities/transaction";
import { TransactionRepo } from "./type";

export default function createTransactionRepoSQLite3(): TransactionRepo {
  const FIELDS = `
  id, type, amount, description, timestamp,
  category_id as "categoryId",
  wallet_source_id as "walletSourceId",
  wallet_destination_id as "walletDestinationId"
`.trim();
  return {
    getById: async (client, transactionId): PromiseResult<Transaction> => {
      const queryResult = await client.query<Transaction>(
        `SELECT ${FIELDS} FROM ${Tables.TRANSACTION} WHERE id = ?;`,
        [ transactionId ]
      );
      if (queryResult.isError()) return queryResult.toError();

      const transactions = queryResult.getValue() as Transaction[];
      if (transactions.length === 0) {
        return Result.Error({
          code: "REPO_NOT_FOUND",
          data: {
            table: Tables.TRANSACTION,
            fields: { id: transactionId },
          },
        });
      }

      return Result.Ok(transactions[0]);
    },

    getByWalletId: async (client, walletId): PromiseResult<Transaction[]> => {
      if (!walletId) {
        return Result.Error({
          code: "REPO_MISSING_ID",
          data: { table: Tables.TRANSACTION },
        });
      }

      return client.query<Transaction>(`
SELECT ${FIELDS}
FROM ${Tables.TRANSACTION}
WHERE wallet_source_id = ?
  OR wallet_destination_id = ?
ORDER BY timestamp DESC;
`.trim(), [ walletId, walletId ]);
    },

    create: async (client, transaction): PromiseResult<Transaction> => {
      const queryResult = await client.query<Transaction>(`
INSERT INTO ${Tables.TRANSACTION}(
  type, amount, description,
  category_id,
  wallet_source_id, wallet_destination_id
) VALUES (
  ?, ?, ?,
  ?,
  ?, ?
)
RETURNING ${FIELDS};
`, [
        transaction.type, transaction.amount, transaction.description || null,
        transaction.categoryId,
        transaction.walletSourceId, transaction.walletDestinationId || null,
      ]);
      if (queryResult.isError()) return queryResult.toError();

      return Result.Ok(queryResult.getValue()[0]);
    },

    update: async (client, _transaction): PromiseResult<Transaction> => {
      try {
        return Result.Error({ code: "NOT_IMPLEMENTED" });
      } finally {
        await client.close();
      }
    },

    removeById: async (client, transactionId): PromiseResult<void> => {
      const runResult = await client.run(
        `DELETE FROM ${Tables.TRANSACTION} WHERE id = ?;`,
        [ transactionId ]
      );
      if (runResult.isError()) return runResult.toError();

      if (runResult.getValue().changes === 0) {
        return Result.Error({
          code: "REPO_NO_REMOVE",
          data: { table: Tables.TRANSACTION },
        });
      }

      return Result.Ok();
    },
  };
}

