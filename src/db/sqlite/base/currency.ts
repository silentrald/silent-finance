import { Tables } from "@/db/consts"

export default {
  create: `
CREATE TABLE ${Tables.CURRENCY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short VARCHAR(4) NOT NULL,
  long VARCHAR(3) NOT NULL
)`.trim(),
  insert: `
INSERT INTO ${Tables.CURRENCY}(short, long) VALUES
  ('₱', 'Php'),
  ('$', 'Usd')
;`.trim(),
}
