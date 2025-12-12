import { compileValidator } from "../modules/ajv";

export interface Wallet {
  id?: number;
  name: string;
  amount: number;
  color: string; // TODO: Create type for this
}

const validate = compileValidator<Wallet>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true, },
    name: { type: "string", },
    amount: { type: "integer", },
    color: { type: "string", color: true, },
  },
  required: [ "name" ],
  additionalProperties: false,
});

export function validateWallet(wallet: Wallet) {
  return validate(wallet);
}
