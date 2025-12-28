import { PromiseResult, Result } from "@/types/result";
import { Tables } from "@/db/consts";
import { TransactionDenomination } from "@/entities/transaction-denomination";
import { TransactionDenominationRepo } from "./types";

export default function createTransactionDenominationRepoSQLite3(): TransactionDenominationRepo {
  const FIELDS = `
transaction_id as "transactionId",
denomination_id as "denominationId",
count
`.trim();

  return {
    getByTransactionId: async (client, transactionId): PromiseResult<TransactionDenomination[]> => {
      return await client.query(
        `SELECT ${FIELDS} FROM ${Tables.TRANSACTION_DENOMINATION} WHERE transaction_id = ?;`,
        [ transactionId ]
      );
    },

    createList: async (client, transactionDenominations): PromiseResult<TransactionDenomination[]> => {
      if (!client.isTransaction()) {
        return Result.Error({
          code: "REPO_REQUIRE_TRANSACTION",
          data: { table: Tables.TRANSACTION_DENOMINATION },
        });
      }

      const query = `
INSERT INTO ${Tables.TRANSACTION_DENOMINATION} (
  transaction_id, denomination_id, count
)
VALUES (?, ?, ?)
RETURNING *;`.trim();

      const inserted: TransactionDenomination[] = [];
      for (const td of transactionDenominations) {
        const result = await client.query<TransactionDenomination>(query, [
          td.transactionId, td.denominationId, td.count,
        ]);
        if (result.isError()) return result.toError();
        inserted.push(result.getValue()[0])
      }

      return Result.Ok(inserted);
    },

    removeByTransactionId: async (client, transactionId): PromiseResult<void> => {
      const result = await client.run(
        `DELETE FROM ${Tables.TRANSACTION_DENOMINATION} WHERE transaction_id = ?;`,
        [ transactionId ]
      );
      if (result.isError()) return result.toError();

      if (result.getValue().changes === 0) {
        return Result.Error({
          code: "REPO_NO_REMOVE",
          data: { table: Tables.TRANSACTION_DENOMINATION },
        });
      }

      return Result.Ok();
    },
  }
}
