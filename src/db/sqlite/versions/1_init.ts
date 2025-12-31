import { Datatypes } from "..";
import { Tables } from "@/db/consts";
import { TransactionType } from "@/enums/transaction";

export default [
// Create Tables
  `
CREATE TABLE ${Tables.CURRENCY} (
  id CHAR(3) PRIMARY KEY NOT NULL,
  unicode VARCHAR(4) NOT NULL
)`.trim(),
  `
CREATE TABLE ${Tables.WALLET} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  color ${Datatypes.COLOR} NOT NULL,
  currency_id CHAR(3) NOT NULL,
  has_denomination INTEGER NOT NULL,
  FOREIGN KEY (currency_id) REFERENCES ${Tables.CURRENCY}(id),
  UNIQUE (name)
);`.trim(),
  `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL,
  icon TEXT,
  type CHAR(1),
  UNIQUE (name, type)
);`.trim(),
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
  FOREIGN KEY (category_id) REFERENCES ${Tables.CATEGORY}(id),
  FOREIGN KEY (wallet_source_id) REFERENCES ${Tables.WALLET}(id),
  FOREIGN KEY (wallet_destination_id) REFERENCES ${Tables.WALLET}(id)
);`.trim(),
  `
CREATE TABLE ${Tables.DENOMINATION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  currency_id CHAR(3) NOT NULL,
  FOREIGN KEY (currency_id) REFERENCES ${Tables.CURRENCY}(id),
  UNIQUE(amount, currency_id)
);`.trim(),
  `
CREATE TABLE ${Tables.WALLET_DENOMINATION} (
  wallet_id INTEGER NOT NULL,
  denomination_id INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (wallet_id, denomination_id),
  FOREIGN KEY (wallet_id) REFERENCES ${Tables.WALLET}(id)
    ON DELETE CASCADE,
  FOREIGN KEY (denomination_id) REFERENCES ${Tables.DENOMINATION}(id)
);`.trim(),
  `
CREATE TABLE ${Tables.TRANSACTION_DENOMINATION} (
  transaction_id INTEGER NOT NULL,
  denomination_id INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (transaction_id, denomination_id),
  FOREIGN KEY (transaction_id) REFERENCES ${Tables.TRANSACTION}(id)
    ON DELETE CASCADE,
  FOREIGN KEY (denomination_id) REFERENCES ${Tables.DENOMINATION}(id)

);`.trim(),

  // Inserts
  `
INSERT INTO ${Tables.CATEGORY}(name, color, icon, type) VALUES
  ('Food', '#FA6868', '/images/restaurant.png', '${TransactionType.EXPENSE}'),
  ('Transportation', '#5A9CB5', '/images/car.png', '${TransactionType.EXPENSE}'),
  ('Bills', '#FACE68', '/images/receipt.png', '${TransactionType.EXPENSE}'),
  ('Salary', '#80EF80', '/images/cash.png', '${TransactionType.INCOME}'),
  ('Donation', '#FFEE8C', '/images/push.png', '${TransactionType.INCOME}'),
  ('Fund Transfer', '#5A9CB5', '/images/paper-plane.png', '${TransactionType.TRANSFER}'),
  ('Other', '#CCCCCC', '/images/help-outline.png', null)
;`.trim(),
  `
INSERT INTO ${Tables.CURRENCY}(id, unicode) VALUES
  ('Php', '₱'),
  ('Usd', '$')
;`.trim(),
  `
INSERT INTO ${Tables.DENOMINATION}(amount, currency_id) VALUES
  -- Php
  (100, 'Php'), (500, 'Php'), (1000, 'Php'), (2000, 'Php'),
  (5000, 'Php'), (10000, 'Php'), (20000, 'Php'),
  (50000, 'Php'), (100000, 'Php'),
  -- Usd
  (1, 'Usd'), (5, 'Usd'), (10, 'Usd'), (25, 'Usd'), (50, 'Usd'),
  (100, 'Usd'), (200, 'Usd'), (500, 'Usd'), (1000, 'Usd'),
  (2000, 'Usd'), (5000, 'Usd'), (10000, 'Usd')
;`.trim(),
];
