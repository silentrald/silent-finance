import { compileValidator } from "@/modules/ajv";

export interface Denomination {
  id: number;
  amount: number;
  currencyId: string;
}

export interface CreateDenomination {
  amount: number;
  currencyId: string;
}

const validate = compileValidator<Denomination>({
  type: "object",
  properties: {
    id: { type: "integer" },
    amount: { type: "integer", minimum: 0 },
    currencyId: { type: "string", minLength: 3, maxLength: 3 },
  },
  required: [ "id", "amount", "currencyId" ],
  additionalProperties: false,
});

export function validateDenomination(denomination: Denomination) {
  return validate(denomination);
}

const validateCreate = compileValidator<CreateDenomination>({
  type: "object",
  properties: {
    amount: { type: "integer", minimum: 0 },
    currencyId: { type: "string", minLength: 3, maxLength: 3 },
  },
  required: [ "amount", "currencyId" ],
  additionalProperties: false,
});

export function validateCreateDenomination(denomination: CreateDenomination) {
  return validateCreate(denomination);
}
