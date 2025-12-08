import { test } from "vitest";
import Database from "better-sqlite3";
// @ts-ignore
import infos from "@/db/sqlite/base";

test("Latest version database test", async () => {
  const db = new Database(":memory:");

  for (const i of infos) {
    db.exec(i.createQuery);
  }

  db.close();
});
