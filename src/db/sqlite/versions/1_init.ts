import { Datatypes } from "..";
import { Tables } from "@/db/consts";

export default [
  `
CREATE TABLE ${Tables.WALLET} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  color ${Datatypes.COLOR} NOT NULL
);
`.trim(),
  `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL
);
`.trim(),
`
CREATE TABLE ${Tables.TRANSACTION} (
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
`.trim()
];
