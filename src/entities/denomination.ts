import { compileValidator } from "@/modules/ajv";

export interface Denomination {
  id?: number;
  amount: number;
  currencyId: string;
}

const validate = compileValidator<Denomination>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    amount: { type: "integer", minimum: 0 },
    currencyId: { type: "string", minLength: 3, maxLength: 3 },
  },
  required: [ "amount", "currencyId" ],
  additionalProperties: false,
});

export function validateDenomination(denomination: Denomination) {
  return validate(denomination);
}
