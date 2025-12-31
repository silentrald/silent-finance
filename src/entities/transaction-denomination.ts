import { JSONSchemaType } from "ajv";
import { compileValidator } from "@/modules/ajv";

export interface TransactionDenomination {
  transactionId: number;
  denominationId: number;
  count: number;
}

export interface CreateTransactionDenomination {
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

export const createTransactionDenominationSchema: JSONSchemaType<CreateTransactionDenomination> = {
  type: "object",
  properties: {
    denominationId: { type: "integer" },
    count: { type: "integer" },
  },
  required: [ "denominationId", "count" ],
  additionalProperties: false,
};
const validateCreate = compileValidator<CreateTransactionDenomination>(createTransactionDenominationSchema);

export function validateCreateTransactionDenomination(
  transactionDenomination: CreateTransactionDenomination
) {
  return validateCreate(transactionDenomination);
}
