import _1_init from "./1_init";
import _2_negate_transaction_denomination from "./2_negate_transaction_denomination";
import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";

const upgrades: capSQLiteVersionUpgrade[] = [
  {
    toVersion: 1,
    statements: _1_init,
  },
  {
    toVersion: 2,
    statements: _2_negate_transaction_denomination,
  },
];

export default upgrades;

