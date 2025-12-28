import { Tables } from "@/db/consts";

const transactionDenominationQuery = `
CREATE TABLE ${Tables.TRANSACTION_DENOMINATION} (
  transaction_id INTEGER NOT NULL,
  denomination_id INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (transaction_id, denomination_id),
  FOREIGN KEY (transaction_id) REFERENCES ${Tables.TRANSACTION}(id)
    ON DELETE CASCADE,
  FOREIGN KEY (denomination_id) REFERENCES ${Tables.DENOMINATION}(id)
);`.trim();

export default transactionDenominationQuery;
