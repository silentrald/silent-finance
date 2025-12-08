import { test } from "vitest";
// @ts-ignore
import versions from "@/db/sqlite/versions";
import Database from "better-sqlite3";

test("Full version database test", () => {
  const db = new Database(":memory:");

  for (const v of versions) {
    for (const query of v) {
      db.exec(query);
    }
  }

  db.close();
});

