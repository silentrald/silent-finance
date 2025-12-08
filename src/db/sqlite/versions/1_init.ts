import { SCHEMA_NAME, TYPES } from "..";
import categorySQLite from "../base/category";
import walletSQLite from "../base/wallet";

export default [
  `
CREATE TABLE ${SCHEMA_NAME}.${walletSQLite.table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${TYPES.COLOR}
);
`.trim(),
  `
CREATE TABLE ${SCHEMA_NAME}.${categorySQLite.table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);
`.trim(),
];
