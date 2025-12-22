import { Datatypes } from "..";
import { Tables } from "@/db/consts";
import { TransactionType } from "@/enums/transaction";

export default {
  create: `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL,
  icon TEXT,
  type CHAR(1),
  UNIQUE (name, type)
);
  `.trim(),
  insert: `
INSERT INTO ${Tables.CATEGORY}(name, color, icon, type) VALUES
  ('Food', '#FA6868', '/images/restaurant.png', '${TransactionType.EXPENSE}'),
  ('Transportation', '#5A9CB5', '/images/car.png', '${TransactionType.EXPENSE}'),
  ('Bills', '#FACE68', '/images/receipt.png', '${TransactionType.EXPENSE}'),
  ('Salary', '#FA6868', '/images/cash.png', '${TransactionType.INCOME}'),
  ('Donation', '#5A9CB5', '/images/push.png', '${TransactionType.INCOME}'),
  ('Fund Transfer', '#5A9CB5', '/images/paper-plane.png', '${TransactionType.TRANSFER}'),
  ('Other', '#CCCCCC', '/images/help-outline.png', null)
;`.trim(),
};
