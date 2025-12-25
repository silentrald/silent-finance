import { Datatypes } from "..";
import { Tables } from "@/db/consts";
import { TransactionType } from "@/enums/transaction";

export default [
// Create Tables
  `
CREATE TABLE ${Tables.CURRENCY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short VARCHAR(4) NOT NULL,
  long VARCHAR(3) NOT NULL,
  UNIQUE(short, long)
)`.trim(),
  `
CREATE TABLE ${Tables.WALLET} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  color ${Datatypes.COLOR} NOT NULL,
  currency_id ${Tables.CURRENCY} NOT NULL,
  has_denomination INTEGER NOT NULL,
  FOREIGN KEY (currency_id) REFERENCES ${Tables.CURRENCY}(id),
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
  has_denomination INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES ${Tables.CATEGORY}(id),
  FOREIGN KEY (wallet_source_id) REFERENCES ${Tables.WALLET}(id),
  FOREIGN KEY (wallet_destination_id) REFERENCES ${Tables.WALLET}(id)
);
`.trim(),
  `
CREATE TABLE ${Tables.DENOMINATION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  currency_id INTEGER NOT NULL,
  FOREIGN KEY (currency_id) REFERENCES ${Tables.CURRENCY}(id),
  UNIQUE(amount, currency_id)
)`.trim(),

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
  `
INSERT INTO ${Tables.CURRENCY}(short, long) VALUES
  ('₱', 'Php'),
  ('$', 'Usd')
;`.trim(),
  `
INSERT INTO ${Tables.DENOMINATION}(amount, currency_id) VALUES
  (100, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (500, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (1000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (2000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (5000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (10000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (20000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (50000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (100000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Php')),
  (1, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (5, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (10, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (25, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (50, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (100, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (200, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (500, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (1000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (2000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (5000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd')),
  (10000, (SELECT id FROM ${Tables.CURRENCY} WHERE long = 'Usd'))
;`.trim(),
];
