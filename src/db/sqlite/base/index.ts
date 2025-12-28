import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";
import category from "./category";
import currency from "./currency";
import denomination from "./denomination";
import transaction from "./transaction";
import transactionDenomination from "./transaction-denomination";
import wallet from "./wallet";
import walletDenomination from "./wallet-denomination";

// Should be ordered
const statements: string[] = [
  // Create Statements
  currency.create,
  wallet,
  category.create,
  transaction,
  denomination.create,
  walletDenomination,
  transactionDenomination,

  // Initial Data
  category.insert,
  currency.insert,
  denomination.insert,
];

export default {
  toVersion: 1,
  statements,
} as capSQLiteVersionUpgrade;
