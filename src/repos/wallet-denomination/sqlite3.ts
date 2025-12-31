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

  const INSERT_QUERY = `
INSERT INTO ${Tables.WALLET_DENOMINATION} (
  wallet_id, denomination_id, count
)
VALUES (?, ?, ?)
RETURNING ${FIELDS};`.trim()

  return {
    getByWalletId: async (client, walletId): PromiseResult<WalletDenomination[]> =>  {
      return await client.query(
        `SELECT ${FIELDS} FROM ${Tables.WALLET_DENOMINATION} WHERE wallet_id = ?;`,
        [ walletId ]
      );
    },

    create: async (client, walletDenomination) => {
      const result = await client.query<WalletDenomination>(INSERT_QUERY, [
        walletDenomination.walletId,
        walletDenomination.denominationId,
        walletDenomination.count,
      ]);
      if (result.isError()) return result.toError();

      return Result.Ok(result.getValue()[0]);
    },

    createList: async (
      client, walletId, walletDenominations
    ) => {
      if (!client.isTransaction()) {
        return Result.Error({
          code: "REPO_REQUIRE_TRANSACTION",
          data: { table: Tables.WALLET_DENOMINATION },
        });
      }

      const inserted: WalletDenomination[] = [];
      for (const wd of walletDenominations) {
        const result = await client.query<WalletDenomination>(INSERT_QUERY, [
          walletId, wd.denominationId, wd.count,
        ]);
        if (result.isError()) return result.toError();
        inserted.push(result.getValue()[0]);
      }

      return Result.Ok(inserted);
    },

    update: async (client, walletDenomination) => {
      const result = await client.run(`
UPDATE ${Tables.WALLET_DENOMINATION}
SET count = ?
WHERE wallet_id = ?
  AND denomination_id = ?;
`.trim(), [
        walletDenomination.count,
        walletDenomination.walletId,
        walletDenomination.denominationId,
      ]);
      if (result.isError()) return result.toError();

      if (result.getValue().changes === 0) {
        return Result.Error({
          code: "REPO_NO_UPDATE",
          data: { table: Tables.WALLET_DENOMINATION },
        });
      }

      return Result.Ok(walletDenomination);
    },

    removeByWalletId: async (client, walletId) => {
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

    removeByIds: async (client, walletId, denominationId) => {
      const result = await client.run(
        `DELETE FROM ${Tables.WALLET_DENOMINATION} WHERE wallet_id = ? AND denomination_id = ?;`,
        [ walletId, denominationId ]
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
