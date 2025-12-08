import { DatabaseInfo } from "../types";

export const TABLE_NAME = "categories";

const categorySQLite: DatabaseInfo = {
  table: TABLE_NAME,
  createQuery: `
CREATE TABLE ${TABLE_NAME} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);
`.trim(),
};

export default categorySQLite;
