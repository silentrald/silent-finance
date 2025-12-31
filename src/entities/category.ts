import { HexColor } from "@/types";
import { TransactionType } from "@/enums/transaction";
import { compileValidator } from "../modules/ajv";

export interface Category {
  id: number;
  name: string;
  color: HexColor;
  icon?: string;
  type?: TransactionType | null;
}

export interface CreateCategory {
  name: string;
  color: HexColor;
  icon?: string;
  type?: TransactionType | null;
}

const validate = compileValidator<Category>({
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string", minLength: 1, maxLength: 50 },
    color: { type: "string", color: true },
    icon: { type: "string", nullable: true },
    type: { type: "string", nullable: true },
  },
  required: [ "id", "name", "color" ],
  additionalProperties: false,
});

export function validateCategory(category: Category) {
  return validate(category);
}

const validateCreate = compileValidator<CreateCategory>({
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 50 },
    color: { type: "string", color: true },
    icon: { type: "string", nullable: true },
    type: { type: "string", nullable: true },
  },
  required: [ "name", "color" ],
  additionalProperties: false,
});

export function validateCreateCategory(category: CreateCategory) {
  return validateCreate(category);
}

