import { compileValidator } from "../modules/ajv";

export interface Wallet {
  id?: number;
  name: string;
  amount: number;
  color: string; // TODO: Create type for this
  currencyId: number;
  // Check if there are coins/bills attached to the wallet for tracking
  hasDenomination: boolean;
}

const validate = compileValidator<Wallet>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    name: { type: "string" },
    amount: { type: "integer" },
    color: { type: "string", color: true },
    currencyId: { type: "integer" },
    hasDenomination: { type: "boolean" },
  },
  required: [
    "name", "amount", "color",
    "currencyId", "hasDenomination",
  ],
  additionalProperties: false,
});

export function validateWallet(wallet: Wallet) {
  return validate(wallet);
}
