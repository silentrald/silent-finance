import { Tables } from "@/db/consts";

export default {
  create: `
CREATE TABLE ${Tables.DENOMINATION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  currency_id INTEGER NOT NULL,
  FOREIGN KEY (currency_id) REFERENCES ${Tables.CURRENCY}(id),
  UNIQUE(amount, currency_id)
)`.trim(),
  insert: `
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
}
