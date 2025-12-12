import { compileValidator } from "../modules/ajv";

export interface Category {
  id?: number;
  name: string;
  color: string; // TODO: Create a type for this
  // icon: string;
}

const validate = compileValidator<Category>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true, },
    name: { type: "string", },
    color: { type: "string", color: true, },
  },
  required: [ "name" ],
  additionalProperties: false,
});

export function validateCategory(category: Category) {
  return validate(category);
}
