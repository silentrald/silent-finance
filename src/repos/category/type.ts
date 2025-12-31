import { Category, CreateCategory } from "@/entities/category";
import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export interface CategoryRepo {
  getAll(client: DatabaseClient): PromiseResult<Category[]>;

  create(client: DatabaseClient, category: CreateCategory): PromiseResult<Category>;
  update(client: DatabaseClient, category: Category): PromiseResult<Category>;

  removeById(client: DatabaseClient, categoryId: number): PromiseResult<void>;
}
