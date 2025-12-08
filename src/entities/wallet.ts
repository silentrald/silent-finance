import { compileValidator } from "../shared/ajv";

export interface Wallet {
  id: number;
  name: string;
  color: string;
}

const validate = compileValidator<Wallet>({
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    color: { type: "string", color: true },
  },
  required: ["name"],
  additionalProperties: false,
});

export function validateWallet(wallet: Wallet) {
  return validate(wallet);
}
