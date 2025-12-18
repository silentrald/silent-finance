import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { DatabaseClient, DatabaseService } from "./type";
import { PromiseResult, Result } from "@/types/result";
import { Capacitor } from "@capacitor/core";
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
import base from "@/db/sqlite/base";
import logger from "../logger";
import versions from "@/db/sqlite/versions";

const READONLY = false;

class DatabaseClientImpl implements DatabaseClient {
  private database: SQLiteDBConnection;

  constructor(database: SQLiteDBConnection) {
    this.database = database;
  }

  async query<T>(statement: string, values?: any[]): PromiseResult<T[]> {
    try {
      // Transaction set to false, seems to be that the parameter tells
      //   if the single query statement is a transaction, not that it is
      //   a part of transaction
      const result = await this.database.query(statement, values, false);
      return Result.Ok(result.values as T[]);
    } catch (error: any) {
      return Result.Error({ code: "DATABASE_QUERY", error });
    }
  }

  async run(statement: string, values?: any[]): PromiseResult<{ changes: number; }> {
    try {
      // Transaction set to false, seems to be that the parameter tells
      //   if the single query statement is a transaction, not that it is
      //   a part of transaction
      const result = await this.database.run(statement, values, false);
      return Result.Ok({
        changes: result.changes?.changes || 0,
      });
    } catch (error: any) {
      return Result.Error({ code: "DATABASE_RUN", error });
    }
  }

  async transaction<T>(handler: () => PromiseResult<T>): PromiseResult<T> {
    try {
      await this.database.beginTransaction();
      const active = await this.database.isTransactionActive();
      if (!active) {
        return Result.Error({
          code: "DATABASE_TRANSACTION",
          error: new Error("Transaction not active"),
        });
      }

      const result = await handler();

      if (result.isError()) {
        await this.database.rollbackTransaction();
        return result.toError();
      }

      await this.database.commitTransaction();
      return result;
    } catch (error: any) {
      await this.database.rollbackTransaction();
      return Result.Error({ code: "DATABASE_TRANSACTION", error });
    }
  }

  async close(): PromiseResult<void> {
    try {
      await this.database.close();
      return Result.Ok();
    } catch (error: any) {
      // Error is not handled sometimes
      logger.error("Could not close database", error);
      return Result.Error({ code: "DATABASE_CLOSE", error });
    }
  }
}

export default function createSQLite3DatabaseService({
  databaseName,
  version,
  encryptionSecret,
}: {
  databaseName: string;
  version: number;
  encryptionSecret: string;
}): DatabaseService {
  const platform = Capacitor.getPlatform();
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const shouldEncrypt = encryptionSecret !== "no-encryption";

  async function shouldRetrieveConnection() {
    const connectionConsistency = (await sqlite.checkConnectionsConsistency())
      .result;
    const isConnection = (await sqlite.isConnection(databaseName, READONLY))
      .result;
    return connectionConsistency && isConnection;
  }

  return {
    async init() {
      try {
        if (platform === "web") {
          customElements.define("jeep-sqlite", JeepSqlite);
          const jeepSqliteElement = document.createElement("jeep-sqlite");
          document.body.appendChild(jeepSqliteElement);
          await customElements.whenDefined("jeep-sqlite");
          await sqlite.initWebStore();
        }

        const { result: existing } = await sqlite.isDatabase(databaseName);
        await sqlite.addUpgradeStatement(
          databaseName,
          existing ? versions : [ base ]
        );

        return Result.Ok();
      } catch (error: any) {
        return Result.Error({ code: "DATABASE_INIT", error });
      }
    },

    async getClient(): PromiseResult<DatabaseClient> {
      try {
      const db: SQLiteDBConnection = (await shouldRetrieveConnection())
        ? await sqlite.retrieveConnection(databaseName, READONLY)
        : await sqlite.createConnection(
            databaseName,
            shouldEncrypt,
            encryptionSecret,
            version,
            READONLY
          );
      await db.open();

      return Result.Ok(new DatabaseClientImpl(db));
      } catch (error: any) {
        return Result.Error({ code: "DATABASE_GET_CLIENT", error });
      }
    },
  };
}
