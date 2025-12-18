import { PromiseResult, Result } from "@/types/result";
import { Category } from "@/entities/category";
import { CategoryRepo } from "./type";
import { Tables } from "@/db/consts";

export default function createSQLite3CategoryRepo(): CategoryRepo {
  return {
    getAll: async (client): PromiseResult<Category[]> => {
      const queryResult = await client.query(
        `SELECT * FROM ${Tables.CATEGORY};`
      );
      if (queryResult.isError()) return queryResult.toError();

      return Result.Ok(queryResult.getValue() as Category[]);
    },

    create: async (client, category): PromiseResult<Category> => {
      const queryResult = await client.query<Category>(`
INSERT INTO ${Tables.CATEGORY}(name, color, icon)
VALUES (?, ?, ?)
RETURNING id;
        `.trim(),
        [ category.name, category.color, category.icon ?? null ]
      );
      if (queryResult.isError()) return queryResult.toError();

      category.id = queryResult.getValue()[0].id;
      return Result.Ok(category);
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
