import { Denomination } from "@/entities/denomination";
import { DenominationRepo } from "./types";
import { PromiseResult } from "@/types/result";
import { Tables } from "@/db/consts";

export default function createDenominationRepoSQLite3(): DenominationRepo {
  const FIELDS = `
id, amount,
currency_id as "currencyId"
  `.trim();
  return {
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
