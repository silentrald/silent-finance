import { Tables } from "@/db/consts";

const transactionQuery = `
CREATE TABLE ${Tables.TRANSACTION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type CHAR(1) NOT NULL,
  amount INTEGER NOT NULL,
  description VARCHAR(100),
  category_id INTEGER NOT NULL,
  wallet_source_id INTEGER NOT NULL,
  wallet_destination_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (wallet_source_id) REFERENCES wallets(id),
  FOREIGN KEY (wallet_destination_id) REFERENCES wallets(id)
);
`.trim();

export default transactionQuery;
