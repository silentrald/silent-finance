import { Category, validateCategory } from "@/entities/category";
import { CategoryRepo } from "@/repos/category/type";
import CategoryUseCase from "./types";
import { DatabaseService } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export default function createCategoryUseCaseV1({
  databaseService,
  categoryRepo,
}: {
  databaseService: DatabaseService;
  categoryRepo: CategoryRepo;
}): CategoryUseCase {
  return {
    getAllCategories: async (): PromiseResult<Category[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await categoryRepo.getAll(client);
      } finally {
        await client.close();
      }
    },

    createCategory: async (category): PromiseResult<Category> => {
      const validateResult = validateCategory(category);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await categoryRepo.create(client, category);
      } finally {
        await client.close();
      }
    },

    removeCategory: async (categoryId): PromiseResult<void> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await categoryRepo.removeById(client, categoryId);
      } finally {
        await client.close();
      }
    },
  };
}

