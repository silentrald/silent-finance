import { JSONSchemaType } from "ajv";
import { compileValidator } from "@/modules/ajv";

export interface WalletDenomination {
  walletId: number;
  denominationId: number;
  count: number;
}

export interface CreateWalletDenomination {
  denominationId: number;
  count: number;
}

const validate = compileValidator<WalletDenomination>({
  type: "object",
  properties: {
    walletId: { type: "number" },
    denominationId: { type: "number" },
    count: { type: "number", minimum: 0 },
  },
  required: [ "walletId", "denominationId", "count" ],
  additionalProperties: false,
});

export function validateWalletDenomination(walletDenomination: WalletDenomination) {
  return validate(walletDenomination);
}

export const createWalletDenominationSchema: JSONSchemaType<CreateWalletDenomination> = {
  type: "object",
  properties: {
    denominationId: { type: "integer" },
    count: { type: "integer" },
  },
  required: [ "denominationId", "count" ],
  additionalProperties: false,
};
const validateCreate = compileValidator(createWalletDenominationSchema);

export function validateCreateWalletDenomination(
  walletDenomination: CreateWalletDenomination
) {
  return validateCreate(walletDenomination);
}
