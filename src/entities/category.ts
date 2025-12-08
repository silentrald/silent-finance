import { compileValidator } from "../shared/ajv";

export interface Category {
  id: number;
  name: string;
  // icon: string;
}

const validate = compileValidator<Category>({
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
});

export function validateCategory(category: Category) {
  return validate(category);
}
