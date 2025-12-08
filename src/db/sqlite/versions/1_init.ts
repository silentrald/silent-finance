import { TYPES } from "..";
import categorySQLite from "../base/category";
import transactionSQLite from "../base/transaction";
import walletSQLite from "../base/wallet";

export default [
  `
CREATE TABLE ${walletSQLite.table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${TYPES.COLOR}
);
`.trim(),
  `
CREATE TABLE ${categorySQLite.table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL
);
`.trim(),
`
CREATE TABLE ${transactionSQLite.table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type CHAR(1) NOT NULL,
  amount INTEGER NOT NULL,
  description VARCHAR(100),
  category_id INTEGER NOT NULL,
  wallet_src_id INTEGER NOT NULL,
  wallet_dst_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (wallet_src_id) REFERENCES wallets(id),
  FOREIGN KEY (wallet_dst_id) REFERENCES wallets(id)
);
`.trim(),
];
