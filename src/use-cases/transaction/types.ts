import { PromiseResult } from "@/types/result";
import { Transaction } from "@/entities/transaction";
import { Wallet } from "@/entities/wallet";

export default interface TransactionUseCase {
  getTransactionsByWallet(walletId: number): PromiseResult<Transaction[]>;
  createExpense(transaction: Transaction): PromiseResult<{
    transaction: Transaction;
    wallet: Wallet;
  }>;
  removeTransaction(transactionId: number): PromiseResult<{
    wallet: Wallet;
  }>;
}
