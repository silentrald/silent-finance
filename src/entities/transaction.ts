import { Result } from "@/types/result";
import { TransactionType } from "@/enums/transaction";
import { compileValidator } from "@/modules/ajv";
import { validateWallet } from "./wallet";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description?: string;
  timestamp?: string; // Custom type?
  categoryId: number;
  walletSourceId: number;
  walletDestinationId?: number;
  // Check if there are coins/bills attached to the transaction for tracking
}

export interface CreateTransaction {
  type: TransactionType;
  amount: number;
  description?: string;
  timestamp?: string; // Custom type?
  categoryId: number;
  walletSourceId: number;
  walletDestinationId?: number;
}

const validateWallets = (transaction: Transaction | CreateTransaction): Result<void> => {
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

const validate = compileValidator<Transaction>({
  type: "object",
  properties: {
    id: { type: "integer" },
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

export function validateTransaction(transaction: Transaction) {
  const result = validate(transaction);
  if (result.isError()) return result.toError();

  return validateWallets(transaction);
}

const validateCreate = compileValidator<CreateTransaction>({
  type: "object",
  properties: {
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

export function validateCreateTransaction(transaction: CreateTransaction) {
  const result = validateCreate(transaction);
  if (result.isError()) return result.toError();

  return validateWallet(transaction);
}
