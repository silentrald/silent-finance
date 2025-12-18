import { PromiseResult, Result } from "@/types/result";
import { Tables } from "@/db/consts";
import { Transaction } from "@/entities/transaction";
import { TransactionRepo } from "./type";

export default function createSQLite3TransactionRepo(): TransactionRepo {
  return {
    getByWalletId: async (client, walletId): PromiseResult<Transaction[]> => {
      if (!walletId) {
        return Result.Error({
          code: "REPO_MISSING_ID",
          data: { table: Tables.TRANSACTION },
        });
      }

      return client.query<Transaction>(`
SELECT
  id, type, amount, description,
  category_id as "categoryId",
  wallet_source_id as "walletSourceId",
  wallet_destination_id as "walletDestinationId"
FROM ${Tables.TRANSACTION}
WHERE wallet_source_id = ?
  OR wallet_destination_id = ?;
`.trim(), [ walletId, walletId ]);
    },

    create: async (client, transaction): PromiseResult<Transaction> => {
      const queryResult = await client.query<{ id: number }>(`
INSERT INTO ${Tables.TRANSACTION}(
  type, amount, description,
  category_id,
  wallet_source_id, wallet_destination_id
) VALUES (
  ?, ?, ?,
  ?,
  ?, ?
)
RETURNING id;
`, [
  transaction.type, transaction.amount, transaction.description || null,
  transaction.categoryId,
  transaction.walletSourceId, transaction.walletDestinationId || null,
]);
      if (queryResult.isError()) return queryResult.toError();

      transaction.id = queryResult.getValue()[0].id;
      return Result.Ok(transaction);
    },

    update: async (client, transaction): PromiseResult<Transaction> => {
      try {
        // TODO:
        return Result.Ok(transaction);
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

