import { Category, CreateCategory } from "@/entities/category";
import { PromiseResult } from "@/types/result";

export default interface CategoryUseCase {
  getAllCategories(): PromiseResult<Category[]>;
  createCategory(category: CreateCategory): PromiseResult<Category>;
  removeCategory(categoryId: number): PromiseResult<void>;
}
