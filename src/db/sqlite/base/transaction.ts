import { Tables } from "@/db/consts";

const transactionQuery = `
CREATE TABLE ${Tables.TRANSACTION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type CHAR(1) NOT NULL,
  amount INTEGER NOT NULL,
  description VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INTEGER NOT NULL,
  wallet_source_id INTEGER NOT NULL,
  wallet_destination_id INTEGER,
  has_denomination INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES ${Tables.CATEGORY}(id),
  FOREIGN KEY (wallet_source_id) REFERENCES ${Tables.WALLET}(id),
  FOREIGN KEY (wallet_destination_id) REFERENCES ${Tables.WALLET}(id)
);
`.trim();

export default transactionQuery;
