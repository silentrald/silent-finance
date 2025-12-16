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
import versions from "@/db/sqlite/versions";

const READONLY = false;

class DatabaseClientImpl implements DatabaseClient {
  private database: SQLiteDBConnection;

  constructor(database: SQLiteDBConnection) {
    this.database = database;
  }

  async query<T>(statement: string, values?: any[]): PromiseResult<T[]> {
    try {
      const result = await this.database.query(statement, values);
      return Result.Ok(result.values as T[]);
    } catch (error: any) {
      return Result.Error("DATABASE_QUERY", error);
    }
  }

  async run(statement: string, values?: any[]): PromiseResult<any> {
    try {
      const result = await this.database.run(statement, values);
      return Result.Ok(result.changes); // TODO
    } catch (error: any) {
      return Result.Error("DATABASE_RUN", error);
    }
  }

  async beginTransaction(): PromiseResult<void> {
    try {
      await this.database.beginTransaction();
      return Result.Ok();
    } catch (error: any) {
      return Result.Error("DATABASE_BEGIN_TRANSACTION", error);
    }
  }

  async commitTransaction(): PromiseResult<void> {
    try {
      await this.database.commitTransaction();
      return Result.Ok();
    } catch (error: any) {
      return Result.Error("DATABASE_COMMIT_TRANSACTION", error);
    }
  }

  async rollbackTransaction(): PromiseResult<void> {
    try {
      await this.database.rollbackTransaction();
      return Result.Ok();
    } catch (error: any) {
      return Result.Error("DATABASE_ROLLBACK_TRANSACTION", error);
    }
  }

  async close(): PromiseResult<void> {
    try {
      await this.database.close();
      return Result.Ok();
    } catch (error: any) {
      return Result.Error("DATABASE_CLOSE", error);
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
