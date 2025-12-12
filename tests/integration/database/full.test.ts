import Database from "better-sqlite3";
import { test } from "vitest";
import versions from "@/db/sqlite/versions";

test("Full version database test", () => {
  const db = new Database(":memory:");

  for (const v of versions) {
    for (const query of v.statements) {
      db.exec(query);
    }
  }

  db.close();
});

