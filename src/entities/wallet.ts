import { CreateWalletDenomination, createWalletDenominationSchema } from "./wallet-denomination";
import { HexColor } from "@/types";
import { compileValidator } from "../modules/ajv";

export interface Wallet {
  id: number;
  name: string;
  amount: number;
  color: HexColor;
  currencyId: string;
  // Check if there are coins/bills attached to the wallet for tracking
  hasDenomination: boolean;
}

export interface CreateWallet {
  name: string;
  amount: number;
  color: HexColor;
  currencyId: string;
  // null - hasDenomination = false
  // array or empty [] - hasDenomination = true
  denominations?: CreateWalletDenomination[] | null;
}

const validate = compileValidator<Wallet>({
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    amount: { type: "integer" },
    color: { type: "string", color: true },
    currencyId: { type: "string", minLength: 3, maxLength: 3 },
    hasDenomination: { type: "boolean" },
  },
  required: [
    "id", "name", "amount", "color",
    "currencyId", "hasDenomination",
  ],
  additionalProperties: false,
});

const validateCreate = compileValidator<CreateWallet>({
  type: "object",
  properties: {
    name: { type: "string" },
    amount: { type: "integer" },
    color: { type: "string", color: true },
    currencyId: { type: "string", minLength: 3, maxLength: 3 },
    denominations: {
      type: "array", nullable: true,
      items: createWalletDenominationSchema,
    },
  },
  required: [
    "name", "amount", "color",
    "currencyId",
  ],
  additionalProperties: false,
});

export function validateWallet(wallet: Wallet) {
  return validate(wallet);
}

export function validateCreateWallet(wallet: CreateWallet) {
  return validateCreate(wallet);
}
