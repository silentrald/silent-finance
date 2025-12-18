import { Datatypes } from "..";
import { Tables } from "@/db/consts";

export default [
// Create Tables
  `
CREATE TABLE ${Tables.WALLET} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  color ${Datatypes.COLOR} NOT NULL
);
`.trim(),
  `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL,
  icon TEXT
);
`.trim(),
  `
CREATE TABLE ${Tables.TRANSACTION} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type CHAR(1) NOT NULL,
  amount INTEGER NOT NULL,
  description VARCHAR(100),
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
INSERT INTO ${Tables.CATEGORY}(name, color, icon) VALUES
  ('Food', '#FA6868', '/images/restaurant.png'),
  ('Transportation', '#5A9CB5', '/images/car.png'),
  ('Bills', '#FACE68', '/images/receipt.png');
`.trim(),
];
