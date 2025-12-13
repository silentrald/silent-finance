import _1_init from "./1_init";
import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";

const upgrades: capSQLiteVersionUpgrade[] = [
  {
    toVersion: 1,
    statements: _1_init,
  },
];

export default upgrades;

