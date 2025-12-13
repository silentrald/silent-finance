import { Datatypes } from "..";
import { Tables } from "@/db/consts";

export default {
  create: `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL,
  icon TEXT
);
  `.trim(),
  insert: `
INSERT INTO ${Tables.CATEGORY}(name, color, icon) VALUES
  ('Food', '#FA6868', '/images/restaurant.png'),
  ('Transportation', '#5A9CB5', '/images/car.png'),
  ('Bills', '#FACE68', '/images/receipt.png');
  `.trim(),
};
