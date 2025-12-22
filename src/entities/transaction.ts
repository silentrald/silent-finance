import { Result } from "@/types/result";
import { TransactionType } from "@/enums/transaction";
import { compileValidator } from "@/modules/ajv";

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  description?: string;
  timestamp?: string; // Custom type?
  categoryId: number;
  walletSourceId: number;
  walletDestinationId?: number;
}

const validate = compileValidator<Transaction>({
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    type: { type: "string", minLength: 1, maxLength: 1 },
    amount: { type: "integer", minimum: 1 },
    description: { type: "string", nullable: true, maxLength: 100 },
    timestamp: { type: "string", nullable: true },
    categoryId: { type: "integer" },
    walletSourceId: { type: "integer" },
    walletDestinationId: { type: "integer", nullable: true },
  },
  required: [ "type", "amount", "categoryId", "walletSourceId" ],
  additionalProperties: false,
});

export default function validateTransaction(transaction: Transaction) {
  const result = validate(transaction);
  if (result.isError()) return result.toError();

  if (transaction.type === TransactionType.TRANSFER) {
    if (!transaction.walletDestinationId) {
      return Result.Error({
        code: "ENTITY_INVALID",
        data: [ {
          property: "walletDestinationId",
          code: "required",
          message: "Transaction transfer needs a wallet destination",
        } ],
      });
    }

    if (transaction.walletSourceId === transaction.walletDestinationId) {
      return Result.Error({
        code: "ENTITY_INVALID",
        data: [ {
          property: "wallets",
          code: "same",
          message: "Transaction source and destination wallet are the same",
        } ],
      });
    }
  }

  return Result.Ok();
}
