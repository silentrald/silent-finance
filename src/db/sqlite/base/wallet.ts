import { TYPES } from "..";
import { DatabaseInfo } from "../types";

const TABLE_NAME = "wallets";

const walletSQLite: DatabaseInfo = {
  table: TABLE_NAME,
  createQuery: `
CREATE TABLE ${TABLE_NAME} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${TYPES.COLOR}
);
`.trim(),
};

export default walletSQLite;
