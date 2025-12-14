import { Category } from "@/entities/category";
import { PromiseResult } from "@/types/result";

export default interface CategoryUseCase {
  getAllCategories(): PromiseResult<Category[]>;
  createCategory(category: Category): PromiseResult<Category>;
  removeCategory(categoryId: number): PromiseResult<void>;
}
