import { Category } from "@/entities/category";
import { PromiseResult } from "@/types/result";

export interface CategoryRepo {
  getAll(): PromiseResult<Category[]>;

  create(category: Category): PromiseResult<Category>;
  update(category: Category): PromiseResult<Category>;

  removeById(categoryId: number): PromiseResult<void>;
}
