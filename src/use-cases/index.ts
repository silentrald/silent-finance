import { App } from "vue";
import { DatabaseService } from "@/modules/database/type";
import { UseCases } from "./consts";
import createCategoryUseCaseV1 from "./category/v1";
import createSQLite3CategoryRepo from "@/repos/category/sqlite3";
import createSQLite3TransactionRepo from "@/repos/transaction/sqlite3";
import createSQLite3WalletRepo from "@/repos/wallet/sqlite3";
import createTransactionV1UseCase from "./transaction/v1";
import createWalletUseCaseV1 from "./wallet/v1";

export function setupUseCases({
  app, databaseService,
}: {
  app: App<Element>;
  databaseService: DatabaseService
}) {
  // Repositories
  const categoryRepo = createSQLite3CategoryRepo();
  const transactionRepo = createSQLite3TransactionRepo();
  const walletRepo = createSQLite3WalletRepo();

  app.provide(UseCases.CATEGORY, createCategoryUseCaseV1({
    databaseService, categoryRepo,
  }));
  app.provide(UseCases.TRANSACTION, createTransactionV1UseCase({
    databaseService, transactionRepo, walletRepo,
  }));
  app.provide(UseCases.WALLET, createWalletUseCaseV1({
    databaseService, walletRepo,
  }));
}

