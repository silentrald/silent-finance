import { PromiseResult, Result } from "@/types/result";
import { inject, ref } from "vue";
import { Category } from "@/entities/category";
import CategoryUseCase from "@/use-cases/category/types";
import { TransactionType } from "@/enums/transaction";
import { UseCases } from "@/use-cases/consts";
import { defineStore } from "pinia";
import logger from "@/modules/logger";

const useCategoryStore = defineStore("category", () => {
  const categories = ref([] as Category[]);
  const expenseCategories = ref([] as Category[]);
  const incomeCategories = ref([] as Category[]);
  const transferCategories = ref([] as Category[]);
  const categoryMap = ref({} as Record<number, Category>);

  const categoryUseCase = inject(UseCases.CATEGORY) as CategoryUseCase;

  return {
    getAllCategories: () => categories.value,
    getExpenseCategories: () => expenseCategories.value,
    getIncomeCategories: () => incomeCategories.value,
    getTransferCategories: () => transferCategories.value,

    getCategory: (categoryId: number) => categoryMap.value[categoryId],

    loadCategories: async (): PromiseResult<void> => {
      const categoriesResult = await categoryUseCase.getAllCategories();
      if (categoriesResult.isError()) return categoriesResult.toError();

      const _categories = categoriesResult.getValue();
      categories.value = _categories;

      for (const c of _categories) {
        categoryMap.value[c.id!] = c;

        switch(c.type) {
        case TransactionType.EXPENSE:
          expenseCategories.value.push(c);
          break;

        case TransactionType.INCOME:
          incomeCategories.value.push(c);
          break;

        case TransactionType.TRANSFER:
          transferCategories.value.push(c);
          break;

        default:
          expenseCategories.value.push(c);
          incomeCategories.value.push(c);
          transferCategories.value.push(c);
        }
      }

      logger.debug("Initialized categories");
      return Result.Ok();
    },

    createCategory: async (category: Category): PromiseResult<Category> => {
      const result = await categoryUseCase.createCategory(category);
      if (result.isError()) return result.toError();

      const newCategory = result.getValue();
      categories.value.push(newCategory);
      categoryMap.value[category.id!] = newCategory;

      return result;
    },

    removeCategory: async (categoryId: number): PromiseResult<void> => {
      if (!categoryMap.value[categoryId]) {
        return Result.Ok();
      }

      const result = await categoryUseCase.removeCategory(categoryId);
      if (result.isError()) return result.toError();

      categories.value.splice(categories.value.findIndex(c => c.id === categoryId), 1);
      delete categoryMap.value[categoryId];

      return Result.Ok();
    },
  };
});

export default useCategoryStore;
