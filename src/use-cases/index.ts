import { App } from "vue";
import { DatabaseService } from "@/modules/database/type";
import { UseCases } from "./consts";

import createCategoryRepoSQLite3 from "@/repos/category/sqlite3";
import createCategoryUseCaseV1 from "./category/v1";
import createCurrencyRepoSQLite3 from "@/repos/currency/sqlite3";
import createCurrencyUseCaseV1 from "./currency/v1";
import createDenominationRepoSQLite3 from "@/repos/denomination/sqlite3";
import createDenominationUseCaseV1 from "./denomination/v1";
import createTransactionRepoSQLite3 from "@/repos/transaction/sqlite3";
import createTransactionUseCaseV1 from "./transaction/v1";
import createWalletDenominationRepoSQLite3 from "@/repos/wallet-denomination/sqlite3";
import createWalletRepoSQLite3 from "@/repos/wallet/sqlite3";
import createWalletUseCaseV1 from "./wallet/v1";

import useCategoryStore from "@/stores/category";
import useCurrencyStore from "@/stores/currency";
import useWalletStore from "@/stores/wallet";

export async function setupUseCases({
  app, databaseService,
}: {
  app: App<Element>;
  databaseService: DatabaseService
}) {
  // Repositories
  const categoryRepo = createCategoryRepoSQLite3();
  const currencyRepo = createCurrencyRepoSQLite3();
  const denominationRepo = createDenominationRepoSQLite3();
  const transactionRepo = createTransactionRepoSQLite3();
  const walletRepo = createWalletRepoSQLite3();
  const walletDenominationRepo = createWalletDenominationRepoSQLite3();

  app.provide(UseCases.CATEGORY, createCategoryUseCaseV1({
    databaseService, categoryRepo,
  }));
  app.provide(UseCases.CURRENCY, createCurrencyUseCaseV1({
    databaseService, currencyRepo,
  }));
  app.provide(UseCases.DENOMINATION, createDenominationUseCaseV1({
    databaseService, denominationRepo,
    walletRepo, walletDenominationRepo,
  }));
  app.provide(UseCases.TRANSACTION, createTransactionUseCaseV1({
    databaseService, transactionRepo, walletRepo,
  }));
  app.provide(UseCases.WALLET, createWalletUseCaseV1({
    databaseService, walletRepo,
    denominationRepo, walletDenominationRepo,
  }));

  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();
  const walletStore = useWalletStore();
  await Promise.all([
    categoryStore.loadCategories(),
    currencyStore.loadCurrencies(),
    walletStore.loadWallets(),
  ]);
}

