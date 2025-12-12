import { PromiseResult, Result } from "@/types/result";
import { Category } from "@/entities/category";
import { CategoryRepo } from "./type";
import { DatabaseService } from "@/types/database";
import { Tables } from "@/db/consts";

export default function createSQLite3CategoryRepo({
  databaseService,
}: {
  databaseService: DatabaseService
}): CategoryRepo {
  return {
    getAll: async (): PromiseResult<Category[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const queryResult = await client.query(
          `SELECT * FROM ${Tables.CATEGORY};`
        );
        if (queryResult.isError()) return queryResult.toError();

        return Result.Ok(queryResult.getValue() as Category[]);
      } finally {
        await client.close();
      }
    },

    create: async (category): PromiseResult<Category> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const queryResult = await client.query<Category>(`
INSERT INTO ${Tables.CATEGORY} (name, color)
VALUES (?, ?)
RETURNING id;
          `.trim(),
          [ category.name, category.color ]
        );
        if (queryResult.isError()) return queryResult.toError();

        category.id = queryResult.getValue()[0].id;
        return Result.Ok(category);
      } finally {
        await client.close();
      }
    },

    update: async (category): PromiseResult<Category> => {
      if (category.id === undefined) {
        return Result.Error("Missing category.id");
      }

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const runResult = await client.run(`
UPDATE ${Tables.CATEGORY} SET
  name = ?,
  color = ?
WHERE id = ?;
          `.trim(),
          [ category.name, category.color, category.id ]
        )
        if (runResult.isError()) return runResult.toError();

        if (runResult.getValue().changes === 0) {
          return Result.Error("No category updated");
        }

        return Result.Ok(category);
      } finally {
        await client.close();
      }
    },

    removeById: async (categoryId): PromiseResult<void> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const runResult = await client.run(
          `DELETE FROM ${Tables.CATEGORY} WHERE id = ?;`,
          [ categoryId ]
        );
        if (runResult.isError()) return runResult.toError();

        if (runResult.getValue().changes === 0) {
          return Result.Error("No category deleted")
        }

        return Result.Ok();
      } finally {
        await client.close();
      }
    },
  }
}
