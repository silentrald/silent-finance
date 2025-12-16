import { PromiseResult, Result } from "@/types/result";
import { DatabaseService } from "@/modules/database/type";
import { Tables } from "@/db/consts";
import { Wallet } from "@/entities/wallet";
import { WalletRepo } from "./type";

export default function createSQLite3WalletRepo({
  databaseService,
}: {
  databaseService: DatabaseService;
}): WalletRepo {
  return {
    getById: async (walletId): PromiseResult<Wallet> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const queryResult = await client.query(
          `SELECT * FROM ${Tables.WALLET} WHERE ?;`,
          [ walletId ]
        );
        if (queryResult.isError()) return queryResult.toError();

        return Result.Ok(queryResult.getValue()[0] as Wallet);
      } finally {
        await client.close();
      }
    },

    getAll: async (): PromiseResult<Wallet[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const queryResult = await client
          .query(`SELECT * FROM ${Tables.WALLET};`);
        if (queryResult.isError()) return queryResult.toError();

        return Result.Ok(queryResult.getValue() as Wallet[]);
      } finally {
        await client.close();
      }
    },

    create: async (wallet: Wallet): PromiseResult<Wallet> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
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
      } finally {
        await client.close();
      }
    },

    update: async (wallet: Wallet): PromiseResult<Wallet> => {
      if (wallet.id === undefined) {
        return Result.Error({
          code: "REPO_MISSING_ID",
          data: { table: Tables.WALLET },
        });
      }

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const runResult = await client.run(`
UPDATE ${Tables.WALLET}
SET name = ?,
  amount = ?,
  color = ?
WHERE id = ?;
          `.trim(),
          [
            wallet.name, wallet.amount,
            wallet.color, wallet.id,
          ]
        );
        if (runResult.isError()) return runResult.toError();

        if (runResult.getValue().changes === 0) {
          return Result.Error({
            code: "REPO_NO_REMOVE",
            data: { table: Tables.WALLET },
          });
        }

        return Result.Ok(wallet);
      } finally {
        await client.close();
      }
    },

    removeById: async (walletId: number): PromiseResult<void> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const runResult = await client.run(
          `DELETE FROM ${Tables.WALLET} WHERE id = ?;`,
          [ walletId ]
        );
        if (runResult.isError()) return runResult.toError();

        if (runResult.getValue().changes === 0) {
          return Result.Error({
            code: "REPO_NO_REMOVE",
            data: { table: Tables.WALLET },
          });
        }

        return Result.Ok();
      } finally {
        await client.close();
      }
    },
  };
}
