import { Datatypes } from "..";
import { Tables } from "@/db/consts";


const walletQuery = `
CREATE TABLE ${Tables.WALLET} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  color ${Datatypes.COLOR} NOT NULL,
  UNIQUE (name)
);
`.trim();

export default walletQuery;
