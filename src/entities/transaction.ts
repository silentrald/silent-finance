import { TransactionType } from "@/enums/transaction";
import { compileValidator } from "@/modules/ajv";

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  description?: string;
  categoryId: number;
  walletSourceId: number;
  walletDestinationId?: number;
}

const validate = compileValidator<Transaction>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    type: { type: "string", minLength: 1, maxLength: 1 },
    amount: { type: "integer" },
    description: { type: "string", nullable: true, maxLength: 100 },
    categoryId: { type: "integer" },
    walletSourceId: { type: "integer" },
    walletDestinationId: { type: "integer", nullable: true },
  },
  required: [ "type", "amount", "categoryId", "walletSourceId" ],
  additionalProperties: false,
});

export default function validateTransaction(transaction: Transaction) {
  return validate(transaction);
}
