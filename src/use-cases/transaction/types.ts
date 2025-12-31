import { CreateTransaction, Transaction } from "@/entities/transaction";
import { PromiseResult } from "@/types/result";
import { Wallet } from "@/entities/wallet";

export default interface TransactionUseCase {
  getTransactionsByWallet(walletId: number): PromiseResult<Transaction[]>;

  createExpense(transaction: CreateTransaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
  }>;
  createIncome(transaction: CreateTransaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
  }>;
  createTransfer(transaction: CreateTransaction): PromiseResult<{
    transaction: Transaction;
    sourceWallet: Wallet;
    destinationWallet: Wallet;
  }>;

  removeTransaction(transactionId: number): PromiseResult<{
    sourceWallet: Wallet;
    destinationWallet?: Wallet | undefined;
  }>;
}
