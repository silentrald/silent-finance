import { App } from "vue";
import { DatabaseService } from "@/types/database";
import { UseCases } from "./consts";
import createCategoryUseCase from "./category/v1";
import createSQLite3CategoryRepo from "@/repos/category/sqlite3";

export function setupUseCases({
  app, databaseService,
}: {
  app: App<Element>;
  databaseService: DatabaseService
}) {
  // Repositories
  const categoryRepo = createSQLite3CategoryRepo({ databaseService });

  app.provide(UseCases.CATEGORY, createCategoryUseCase({ categoryRepo }));
}

