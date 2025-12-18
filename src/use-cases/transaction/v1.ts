import { PromiseResult, Result } from "@/types/result";
import { DatabaseService } from "@/modules/database/type";
import { Transaction } from "@/entities/transaction";
import { TransactionRepo } from "@/repos/transaction/type";
import { TransactionType } from "@/enums/transaction";
import TransactionUseCase from "./types";
import { Wallet } from "@/entities/wallet";
import { WalletRepo } from "@/repos/wallet/type";


export default function createTransactionV1UseCase({
  databaseService,
  transactionRepo,
  walletRepo,
}: {
  databaseService: DatabaseService;
  transactionRepo: TransactionRepo;
  walletRepo: WalletRepo;
}): TransactionUseCase {

  return {
    getTransactionsByWallet: async (walletId): PromiseResult<Transaction[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return transactionRepo.getByWalletId(client, walletId);
      } finally {
        await client.close();
      }
    },

    createExpense: async (transaction): PromiseResult<{
      transaction: Transaction;
      wallet: Wallet;
    }> => {
      transaction.type = TransactionType.EXPENSE; // Force to be a expense transaction

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction<{
          transaction: Transaction;
          wallet: Wallet;
        }>(async () => {
          const getResult = await walletRepo.getById(client, transaction.walletSourceId);
          if (getResult.isError()) return getResult.toError();

          const wallet = getResult.getValue();
          wallet.amount -= transaction.amount;

          const transactionResult = await transactionRepo.create(client, transaction);
          if (transactionResult.isError()) return transactionResult.toError();

          const walletResult = await walletRepo.update(client, wallet);
          if (walletResult.isError()) return walletResult.toError();

          return Result.Ok({
            transaction: transactionResult.getValue(),
            wallet: walletResult.getValue(),
          });
        });
      } finally {
        await client.close();
      }
    },

    removeTransaction: async (transactionId): PromiseResult<{
      wallet: Wallet;
    }> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction<{
          wallet: Wallet;
        }>(async () => {
          const getTransactionResult = await transactionRepo.getById(client, transactionId);
          if (getTransactionResult.isError()) return getTransactionResult.toError();
          const transaction = getTransactionResult.getValue();

          const getWalletResult = await walletRepo.getById(client, transaction.walletSourceId);
          if (getWalletResult.isError()) return getWalletResult.toError();
          const wallet = getWalletResult.getValue();

          if (transaction.type === TransactionType.EXPENSE) {
            wallet.amount += transaction.amount;
          }

          const removeResult = await transactionRepo.removeById(client, transactionId);
          if (removeResult.isError()) return removeResult.toError();

          const updateResult = await walletRepo.update(client, wallet);
          if (updateResult.isError()) return updateResult.toError();

          return Result.Ok({
            wallet: updateResult.getValue(),
          });
        });
      } finally {
        await client.close();
      }
    },
  };
}
