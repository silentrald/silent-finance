import { compileValidator } from "@/modules/ajv";

export interface Denomination {
  id?: number;
  amount: number;
  currencyId: number;
}

const validate = compileValidator<Denomination>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    amount: { type: "integer", minimum: 0 },
    currencyId: { type: "integer" },
  },
  required: [ "amount", "currencyId" ],
  additionalProperties: false,
});

export function validateDenomination(denomination: Denomination) {
  return validate(denomination);
}
