import { PromiseResult, Result } from "@/types/result";
import { Category } from "@/entities/category";
import { CategoryRepo } from "./type";
import { Tables } from "@/db/consts";

export default function createCategoryRepoSQLite3(): CategoryRepo {
  return {
    getAll: async (client): PromiseResult<Category[]> => {
      return await client.query(
        `SELECT * FROM ${Tables.CATEGORY};`
      );
    },

    create: async (client, category): PromiseResult<Category> => {
      const queryResult = await client.query<Category>(`
INSERT INTO ${Tables.CATEGORY}(name, color, icon)
VALUES (?, ?, ?)
RETURNING *;
        `.trim(),
      [ category.name, category.color, category.icon ?? null ]
      );
      if (queryResult.isError()) return queryResult.toError();

      return Result.Ok(queryResult.getValue()[0]);
    },

    update: async (client, category): PromiseResult<Category> => {
      if (category.id === undefined) {
        return Result.Error({
          code: "REPO_MISSING_ID",
          data: { table: Tables.CATEGORY },
        });
      }

      const runResult = await client.run(`
UPDATE ${Tables.CATEGORY} SET
  name = ?,
  color = ?,
  icon = ?
WHERE id = ?;
        `.trim(),
      [ category.name, category.color, category.icon, category.id ]
      );
      if (runResult.isError()) return runResult.toError();

      if (runResult.getValue().changes === 0) {
        return Result.Error({
          code: "REPO_NO_UPDATE",
          data: { table: Tables.CATEGORY },
        });
      }

      return Result.Ok(category);
    },

    removeById: async (client, categoryId): PromiseResult<void> => {
      const runResult = await client.run(
        `DELETE FROM ${Tables.CATEGORY} WHERE id = ?;`,
        [ categoryId ]
      );
      if (runResult.isError()) return runResult.toError();

      if (runResult.getValue().changes === 0) {
        return Result.Error({
          code: "REPO_NO_REMOVE",
          data: { table: Tables.CATEGORY },
        });
      }

      return Result.Ok();
    },
  };
}
