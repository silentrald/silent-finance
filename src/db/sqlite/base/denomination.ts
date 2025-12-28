import { Tables } from "@/db/consts";

export default {
  create: `
CREATE TABLE ${Tables.DENOMINATION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  currency_id CHAR(3) NOT NULL,
  FOREIGN KEY (currency_id) REFERENCES ${Tables.CURRENCY}(id),
  UNIQUE(amount, currency_id)
)`.trim(),
  insert: `
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
}
