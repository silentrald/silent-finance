import { Datatypes } from "..";
import { Tables } from "@/db/consts";
import { TransactionType } from "@/enums/transaction";

export default [
// Create Tables
  `
CREATE TABLE ${Tables.WALLET} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  color ${Datatypes.COLOR} NOT NULL,
  UNIQUE (name)
);
`.trim(),
  `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL,
  icon TEXT,
  type CHAR(1),
  UNIQUE (name, type)
);
`.trim(),
  `
CREATE TABLE ${Tables.TRANSACTION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type CHAR(1) NOT NULL,
  amount INTEGER NOT NULL,
  description VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INTEGER NOT NULL,
  wallet_source_id INTEGER NOT NULL,
  wallet_destination_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (wallet_source_id) REFERENCES wallets(id),
  FOREIGN KEY (wallet_destination_id) REFERENCES wallets(id)
);
`.trim(),

  // Inserts
  `
INSERT INTO ${Tables.CATEGORY}(name, color, icon, type) VALUES
  ('Food', '#FA6868', '/images/restaurant.png', '${TransactionType.EXPENSE}'),
  ('Transportation', '#5A9CB5', '/images/car.png', '${TransactionType.EXPENSE}'),
  ('Bills', '#FACE68', '/images/receipt.png', '${TransactionType.EXPENSE}'),
  ('Salary', '#FA6868', '/images/cash.png', '${TransactionType.INCOME}'),
  ('Donation', '#5A9CB5', '/images/push.png', '${TransactionType.INCOME}'),
  ('Fund Transfer', '#5A9CB5', '/images/paper-plane.png', '${TransactionType.TRANSFER}'),
  ('Other', '#CCCCCC', '/images/help-outline.png', null)
;`.trim(),
];
