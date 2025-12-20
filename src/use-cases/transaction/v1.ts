import { PromiseResult, Result } from "@/types/result";
import validateTransaction, { Transaction } from "@/entities/transaction";
import { DatabaseService } from "@/modules/database/type";
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

      const validateResult = validateTransaction(transaction);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
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

    createIncome: async (transaction): PromiseResult<{
      transaction: Transaction;
      wallet: Wallet;
    }> => {
      transaction.type = TransactionType.INCOME; // Force to be a income transaction

      const validateResult = validateTransaction(transaction);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          const getResult = await walletRepo.getById(client, transaction.walletSourceId);
          if (getResult.isError()) return getResult.toError();

          const wallet = getResult.getValue();
          wallet.amount += transaction.amount;

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

    createTransfer: async (transaction): PromiseResult<{
      transaction: Transaction;
      sourceWallet: Wallet;
      destinationWallet: Wallet;
    }> => {
      transaction.type = TransactionType.TRANSFER; // Force to be a transfer transaction

      const validateResult = validateTransaction(transaction);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          const getSourceWalletResult = await walletRepo
            .getById(client, transaction.walletSourceId);
          if (getSourceWalletResult.isError()) return getSourceWalletResult.toError();

          const getDestinationWalletResult = await walletRepo
            .getById(client, transaction.walletDestinationId!);
          if (getDestinationWalletResult.isError()) return getDestinationWalletResult.toError();

          const sourceWallet = getSourceWalletResult.getValue();
          const destinationWallet = getDestinationWalletResult.getValue();
          sourceWallet.amount -= transaction.amount;
          destinationWallet.amount += transaction.amount;

          const transactionResult = await transactionRepo.create(client, transaction);
          if (transactionResult.isError()) return transactionResult.toError();

          const sourceWalletResult = await walletRepo.update(client, sourceWallet);
          if (sourceWalletResult.isError()) return sourceWalletResult.toError();

          const destinationWalletResult = await walletRepo.update(client, destinationWallet);
          if (destinationWalletResult.isError()) return destinationWalletResult.toError();

          return Result.Ok({
            transaction: transactionResult.getValue(),
            sourceWallet: sourceWalletResult.getValue(),
            destinationWallet: destinationWalletResult.getValue(),
          });
        });
      } finally {
        await client.close();
      }
    },

    removeTransaction: async (transactionId): PromiseResult<{
      sourceWallet: Wallet;
      destinationWallet?: Wallet | undefined;
    }> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          const getTransactionResult = await transactionRepo.getById(client, transactionId);
          if (getTransactionResult.isError()) return getTransactionResult.toError();
          const transaction = getTransactionResult.getValue();

          const getWalletResult = await walletRepo.getById(client, transaction.walletSourceId);
          if (getWalletResult.isError()) return getWalletResult.toError();
          const sourceWallet = getWalletResult.getValue();

          let destinationWallet: Wallet | undefined;

          // NOTE: Separate into different function if there are other functionality that is needed to be implemented
          if (transaction.type === TransactionType.EXPENSE) {
            sourceWallet.amount += transaction.amount;
          } else if (transaction.type === TransactionType.INCOME)  {
            sourceWallet.amount -= transaction.amount;
          } else { // TransactionType.TRANSFER
            sourceWallet.amount += transaction.amount;

            const getDestinationWalletResult = await walletRepo
              .getById(client, transaction.walletDestinationId!);
            if (getDestinationWalletResult.isError()) return getDestinationWalletResult.toError();
            destinationWallet = getDestinationWalletResult.getValue();

            destinationWallet.amount -= transaction.amount;
          }

          const removeResult = await transactionRepo.removeById(client, transactionId);
          if (removeResult.isError()) return removeResult.toError();

          const sourceWalletResult = await walletRepo.update(client, sourceWallet);
          if (sourceWalletResult.isError()) return sourceWalletResult.toError();

          if (destinationWallet) {
            const destinationWalletResult = await walletRepo.update(client, destinationWallet);
            if (destinationWalletResult.isError()) return destinationWalletResult.toError();
            destinationWallet = destinationWalletResult.getValue();
          }

          return Result.Ok({
            sourceWallet: sourceWalletResult.getValue(),
            destinationWallet,
          });
        });
      } finally {
        await client.close();
      }
    },
  };
}
