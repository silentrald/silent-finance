import { TransactionType } from "@/enums/transaction";
import { compileValidator } from "../modules/ajv";

export interface Category {
  id?: number;
  name: string;
  color: string; // TODO: Create a type for this
  icon?: string;
  type?: TransactionType | null;
}

const validate = compileValidator<Category>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    name: { type: "string", minLength: 1, maxLength: 50 },
    color: { type: "string", color: true },
    icon: { type: "string", nullable: true },
    type: { type: "string", nullable: true },
  },
  required: [ "name", "color" ],
  additionalProperties: false,
});

export function validateCategory(category: Category) {
  return validate(category);
}
