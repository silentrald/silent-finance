import { compileValidator } from "@/modules/ajv";

export interface Currency {
  id: string; // 3 letter code
  unicode: string;
}

const validate = compileValidator<Currency>({
  type: "object",
  properties: {
    id: { type: "string", minLength: 3, maxLength: 3 },
    unicode: { type: "string", minLength: 1, maxLength: 4 },
  },
  required: [ "id", "unicode" ],
  additionalProperties: false,
});

export function validateCurrency(currency: Currency) {
  return validate(currency);
}
