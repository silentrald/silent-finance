import { App } from "vue";
import { DatabaseService } from "@/modules/database/type";
import { UseCases } from "./consts";
import createCategoryUseCaseV1 from "./category/v1";
import createSQLite3CategoryRepo from "@/repos/category/sqlite3";
import createSQLite3WalletRepo from "@/repos/wallet/sqlite3";
import createWalletUseCaseV1 from "./wallet/v1";

export function setupUseCases({
  app, databaseService,
}: {
  app: App<Element>;
  databaseService: DatabaseService
}) {
  // Repositories
  const categoryRepo = createSQLite3CategoryRepo({ databaseService });
  const walletRepo = createSQLite3WalletRepo({ databaseService });

  app.provide(UseCases.CATEGORY, createCategoryUseCaseV1({ categoryRepo }));
  app.provide(UseCases.WALLET, createWalletUseCaseV1({ walletRepo }));
}

