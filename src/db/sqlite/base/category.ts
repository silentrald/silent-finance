import { Datatypes } from "..";
import { Tables } from "@/db/consts";

const categoryQuery = `
CREATE TABLE ${Tables.CATEGORY} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  color ${Datatypes.COLOR} NOT NULL
);
`.trim();

export default categoryQuery;
