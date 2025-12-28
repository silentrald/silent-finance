import { Tables } from "@/db/consts";

const walletDenominationQuery = `
CREATE TABLE ${Tables.WALLET_DENOMINATION} (
  wallet_id INTEGER NOT NULL,
  denomination_id INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (wallet_id, denomination_id),
  FOREIGN KEY (wallet_id) REFERENCES ${Tables.WALLET}(id)
    ON DELETE CASCADE,
  FOREIGN KEY (denomination_id) REFERENCES ${Tables.DENOMINATION}(id)
);`.trim();

export default walletDenominationQuery;
