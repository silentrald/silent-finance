import { PromiseResult, Result } from "@/types/result"
import { Tables } from "@/db/consts";
import { WalletDenomination } from "@/entities/wallet-denomination"
import { WalletDenominationRepo } from "./types"

export default function createWalletDenominationRepoSQLite3(): WalletDenominationRepo {
  const FIELDS = `
wallet_id as "walletId",
denomination_id as "denominationId",
count
`.trim();

  return {
    getByWalletId: async (client, walletId): PromiseResult<WalletDenomination[]> =>  {
      return await client.query(
        `SELECT ${FIELDS} FROM ${Tables.WALLET_DENOMINATION} WHERE wallet_id = ?;`,
        [ walletId ]
      );
    },

    createList: async (
      client, walletId, walletDenominations
    ): PromiseResult<WalletDenomination[]> => {
      if (!client.isTransaction()) {
        return Result.Error({
          code: "REPO_REQUIRE_TRANSACTION",
          data: { table: Tables.WALLET_DENOMINATION },
        });
      }

      const query = `
INSERT INTO ${Tables.WALLET_DENOMINATION} (
  wallet_id, denomination_id, count
)
VALUES (?, ?, ?)
RETURNING *;`.trim();

      const inserted: WalletDenomination[] = [];
      for (const wd of walletDenominations) {
        const result = await client.query<WalletDenomination>(query, [
          walletId, wd.denominationId, wd.count,
        ]);
        if (result.isError()) return result.toError();
        inserted.push(result.getValue()[0]);
      }

      return Result.Ok(inserted);
    },

    removeByWalletId: async (client, walletId): PromiseResult<void> => {
      const result = await client.run(
        `DELETE FROM ${Tables.WALLET_DENOMINATION} WHERE wallet_id = ?;`,
        [ walletId ]
      );
      if (result.isError()) return result.toError();

      if (result.getValue().changes === 0) {
        return Result.Error({
          code: "REPO_NO_REMOVE",
          data: { table: Tables.WALLET_DENOMINATION },
        });
      }

      return Result.Ok();
    },
  }
}
