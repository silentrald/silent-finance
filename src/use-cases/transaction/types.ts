import { PromiseResult } from "@/types/result";
import { Transaction } from "@/entities/transaction";
import { Wallet } from "@/entities/wallet";

export default interface TransactionUseCase {
  getTransactionsByWallet(walletId: number): PromiseResult<Transaction[]>;

  createExpense(transaction: Transaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
  }>;
  createIncome(transaction: Transaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
  }>;
  createTransfer(transaction: Transaction): PromiseResult<{
    transaction: Transaction;
    sourceWallet: Wallet;
    destinationWallet: Wallet;
  }>;

  removeTransaction(transactionId: number): PromiseResult<{
    sourceWallet: Wallet;
    destinationWallet?: Wallet | undefined;
  }>;
}
