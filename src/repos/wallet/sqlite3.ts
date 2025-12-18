import { PromiseResult, Result } from "@/types/result";
import { Tables } from "@/db/consts";
import { Wallet } from "@/entities/wallet";
import { WalletRepo } from "./type";

export default function createSQLite3WalletRepo(): WalletRepo {
  return {
    getById: async (client, walletId): PromiseResult<Wallet> => {
      const queryResult = await client.query(
        `SELECT * FROM ${Tables.WALLET} WHERE ?;`,
        [ walletId ]
      );
      if (queryResult.isError()) return queryResult.toError();

      const wallets = queryResult.getValue() as Wallet[];
      if (wallets.length === 0) {
        return Result.Error({
          code: "REPO_NOT_FOUND",
          data: {
            table: Tables.WALLET,
            fields: { id: walletId },
          },
        });
      }

      return Result.Ok(wallets[0]);
    },

    getAll: async (client): PromiseResult<Wallet[]> => {
      const queryResult = await client
        .query(`SELECT * FROM ${Tables.WALLET};`);
      if (queryResult.isError()) return queryResult.toError();

      return Result.Ok(queryResult.getValue() as Wallet[]);
    },

    create: async (client, wallet): PromiseResult<Wallet> => {
      const queryResult = await client.query<Wallet>(`
INSERT INTO ${Tables.WALLET} (name, amount, color)
VALUES (?, ?, ?)
RETURNING id;
        `.trim(),
        [ wallet.name, wallet.amount, wallet.color ]
      );
      if (queryResult.isError()) return queryResult.toError();

      wallet.id = queryResult.getValue()[0].id;
      return Result.Ok(wallet);
    },

    update: async (client, wallet): PromiseResult<Wallet> => {
      if (wallet.id === undefined) {
        return Result.Error({
          code: "REPO_MISSING_ID",
          data: { table: Tables.WALLET },
        });
      }

      const runResult = await client.run(`
UPDATE ${Tables.WALLET}
SET name = ?,
  amount = ?,
  color = ?
WHERE id = ?
        `.trim(),
        [
          wallet.name, wallet.amount,
          wallet.color, wallet.id,
        ]
      );
      if (runResult.isError()) return runResult.toError();

      if (runResult.getValue() === 0) {
        return Result.Error({
          code: "REPO_NO_REMOVE",
          data: { table: Tables.WALLET },
        });
      }

      return Result.Ok(wallet);
    },

    removeById: async (client, walletId): PromiseResult<void> => {
      const runResult = await client.run(
        `DELETE FROM ${Tables.WALLET} WHERE id = ?;`,
        [ walletId ]
      );
      if (runResult.isError()) return runResult.toError();

      if (runResult.getValue() === 0) {
        return Result.Error({
          code: "REPO_NO_REMOVE",
          data: { table: Tables.WALLET },
        });
      }

      return Result.Ok();
    },
  };
}
