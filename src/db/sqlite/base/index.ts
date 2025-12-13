import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";
import category from "./category";
import transaction from "./transaction";
import wallet from "./wallet";

// Should be ordered
const statements: string[] = [
  // Create Statements
  wallet,
  category.create,
  transaction,

  // Initial Data
  category.insert,
];

export default {
  toVersion: 1,
  statements,
} as capSQLiteVersionUpgrade;
