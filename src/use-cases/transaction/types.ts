import { CreateTransaction, Transaction } from "@/entities/transaction";
import { Pagination } from "@/types";
import { PromiseResult } from "@/types/result";
import { TransactionDenomination } from "@/entities/transaction-denomination";
import { Wallet } from "@/entities/wallet";

export default interface TransactionUseCase {
  getTransactionsByWallet(
    walletId: number,
    pagination: Pagination
  ): PromiseResult<Transaction[]>;

  createExpense(transaction: CreateTransaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
    transactionDenominations: TransactionDenomination[];
  }>;
  createIncome(transaction: CreateTransaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
    transactionDenominations: TransactionDenomination[];
  }>;
  createTransfer(transaction: CreateTransaction): PromiseResult<{
    transaction: Transaction;
    sourceWallet: Wallet;
    destinationWallet: Wallet;
    transactionDenominations: TransactionDenomination[];
  }>;

  removeTransaction(transactionId: number): PromiseResult<{
    sourceWallet: Wallet;
    destinationWallet?: Wallet | undefined;
  }>;
}
