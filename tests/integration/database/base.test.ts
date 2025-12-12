import Database from "better-sqlite3";
import base from "@/db/sqlite/base";
import { test } from "vitest";

test("Latest version database test", async () => {
  const db = new Database(":memory:");

  for (const s of base.statements) {
    db.exec(s);
  }

  db.close();
});
