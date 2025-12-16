import { Category, validateCategory } from "@/entities/category";
import { CategoryRepo } from "@/repos/category/type";
import CategoryUseCase from "./types";
import { PromiseResult } from "@/types/result";

export default function createCategoryUseCaseV1({
  categoryRepo,
}: {
  categoryRepo: CategoryRepo;
}): CategoryUseCase {
  return {
    getAllCategories: async (): PromiseResult<Category[]> => {
      return await categoryRepo.getAll();
    },

    createCategory: async (category): PromiseResult<Category> => {
      const validateResult = validateCategory(category);
      if (validateResult.isError()) return validateResult.toError();
      return await categoryRepo.create(category);
    },

    removeCategory: async (categoryId): PromiseResult<void> => {
      return await categoryRepo.removeById(categoryId);
    },
  };
}

