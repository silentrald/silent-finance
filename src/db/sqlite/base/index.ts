import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";
import category from "./category";
import currency from "./currency";
import denomination from "./denomination";
import transaction from "./transaction";
import wallet from "./wallet";

// Should be ordered
const statements: string[] = [
  // Create Statements
  currency.create,
  wallet,
  category.create,
  transaction,
  denomination.create,

  // Initial Data
  category.insert,
  currency.insert,
  denomination.insert,
];

export default {
  toVersion: 1,
  statements,
} as capSQLiteVersionUpgrade;
