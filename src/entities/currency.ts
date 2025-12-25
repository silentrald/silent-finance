import { compileValidator } from "@/modules/ajv";

export interface Currency {
  id?: number;
  short: string; // Unicode
  long: string;  // 3 letter code
}

const validate = compileValidator<Currency>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    short: { type: "string", minLength: 1, maxLength: 4 },
    long: { type: "string", minLength: 1, maxLength: 3 },
  },
  required: [ "short", "long" ],
  additionalProperties: false,
});

export function validateCurrency(currency: Currency) {
  return validate(currency);
}
