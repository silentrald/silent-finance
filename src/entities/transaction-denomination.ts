import { compileValidator } from "@/modules/ajv";

export interface TransactionDenomination {
  transactionId: number;
  denominationId: number;
  count: number;
}

const validate = compileValidator<TransactionDenomination>({
  type: "object",
  properties: {
    transactionId: { type: "number" },
    denominationId: { type: "number" },
    count: { type: "number" },
  },
  required: [ "transactionId", "denominationId", "count" ],
  additionalProperties: false,
});

export function validateTransactionDenomination(
  transactionDenomination: TransactionDenomination
) {
  return validate(transactionDenomination);
}
