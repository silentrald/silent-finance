import { App } from "vue";
import { DatabaseService } from "@/types/database";
import { Repos } from "./consts";
import createSQLite3CategoryRepo from "./category/sqlite3";
import createSQLite3TransactionRepo from "./transaction/sqlite3";
import createSQLite3WalletRepo from "./wallet/sqlite3";

export function setupRepos({
  app, databaseService,
}: {
  app: App<Element>;
  databaseService: DatabaseService
}) {
  app.provide(Repos.CATEGORY, createSQLite3CategoryRepo({ databaseService, }));
  app.provide(Repos.TRANSACTION, createSQLite3TransactionRepo({ databaseService, }));
  app.provide(Repos.WALLET, createSQLite3WalletRepo({ databaseService, }));
}

