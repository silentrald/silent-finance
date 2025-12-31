import { PromiseResult, Result } from "@/types/result";
import { Denomination } from "@/entities/denomination";
import { DenominationRepo } from "./types";
import { Tables } from "@/db/consts";

export default function createDenominationRepoSQLite3(): DenominationRepo {
  const FIELDS = `
id, amount,
currency_id as "currencyId"
  `.trim();
  return {
    getById: async (client, denominationId) => {
      const result = await client.query<Denomination>(
        `SELECT ${FIELDS} FROM ${Tables.DENOMINATION} WHERE id = ?;`,
        [ denominationId ]
      );
      if (result.isError()) return result.toError();

      const denominations = result.getValue();
      if (denominations.length === 0) {
        return Result.Error({
          code: "REPO_NOT_FOUND",
          data: {
            table: Tables.DENOMINATION,
            fields: { id: denominationId },
          },
        });
      }

      return Result.Ok(denominations[0]);
    },

    getByCurrencyId: async (client, currencyId): PromiseResult<Denomination[]> => {
      return await client.query(`
SELECT ${FIELDS}
FROM ${Tables.DENOMINATION}
WHERE currency_id = ?
ORDER BY amount ASC;
`.trim(), [ currencyId ]);
    },
  }
}
