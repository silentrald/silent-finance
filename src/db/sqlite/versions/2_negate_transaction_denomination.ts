import { Tables } from "@/db/consts";
import { TransactionType } from "@/enums/transaction";

export default [
// Needs to negate the transaction denomination count
  `
    UPDATE ${Tables.TRANSACTION_DENOMINATION}
    SET count = -1 * count
    FROM (
      SELECT id, type
      FROM ${Tables.TRANSACTION}
    ) t
    WHERE t.id = ${Tables.TRANSACTION_DENOMINATION}.transaction_id
      AND t.type in ('${TransactionType.EXPENSE}', '${TransactionType.TRANSFER}');
  `,
];
