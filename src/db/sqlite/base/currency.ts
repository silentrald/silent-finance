import { Tables } from "@/db/consts"

export default {
  create: `
CREATE TABLE ${Tables.CURRENCY} (
  id CHAR(3) PRIMARY KEY NOT NULL,
  unicode VARCHAR(4) NOT NULL
)`.trim(),
  insert: `
INSERT INTO ${Tables.CURRENCY}(id, unicode) VALUES
  ('Php', '₱'),
  ('Usd', '$')
;`.trim(),
}
