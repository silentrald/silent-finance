import { CreateTransaction, Transaction, validateCreateTransaction } from "@/entities/transaction";
import { CreateTransactionDenomination, TransactionDenomination } from "@/entities/transaction-denomination";
import { DatabaseClient, DatabaseService } from "@/modules/database/type";
import { PromiseResult, Result } from "@/types/result";
import { DenominationRepo } from "@/repos/denomination/types";
import { TransactionDenominationRepo } from "@/repos/transaction-denomination/types";
import { TransactionRepo } from "@/repos/transaction/type";
import { TransactionType } from "@/enums/transaction";
import TransactionUseCase from "./types";
import { Wallet } from "@/entities/wallet";
import { WalletDenominationRepo } from "@/repos/wallet-denomination/types";
import { WalletRepo } from "@/repos/wallet/type";
import logger from "@/modules/logger";

const ADD = 1;
const REMOVE = -1;


export default function createTransactionUseCaseV1({
  databaseService,
  transactionRepo,
  walletRepo,
  denominationRepo,
  walletDenominationRepo,
  transactionDenominationRepo,
}: {
  databaseService: DatabaseService;
  transactionRepo: TransactionRepo;
  walletRepo: WalletRepo;
  denominationRepo: DenominationRepo;
  walletDenominationRepo: WalletDenominationRepo;
  transactionDenominationRepo: TransactionDenominationRepo;
}): TransactionUseCase {

  const calculateAmount = async (
    client: DatabaseClient,
    transaction: CreateTransaction,
    currencyId: string
  ): PromiseResult<number> => {
    if (!transaction.denominations) {
      return Result.Ok(transaction.amount);
    }

    let amount = 0;

    const denominationsResult = await denominationRepo
      .getByCurrencyId(client, currencyId);
    if (denominationsResult.isError())
      return denominationsResult.toError();
    const denominations = denominationsResult.getValue();

    for (const td of transaction.denominations) {
      const d = denominations.find(d => d.id === td.denominationId);
      if (!d) {
        return Result.Error({
          code: "NOT_FOUND",
          data: { entity: "transactionDenomination" },
        });
      }

      const value = td.count * d.amount;
      amount += value;
    }

    return Result.Ok(amount);
  };

  const handleDenominations = async (
    client: DatabaseClient,
    transactionId: number,
    transaction: CreateTransaction
  ): PromiseResult<TransactionDenomination[]> => {
    if (!transaction.denominations) {
      return Result.Ok([]);
    }

    return transactionDenominationRepo.createList(
      client, transactionId, transaction.denominations
    );
  }

  const handleWalletDenominations = async (
    client: DatabaseClient,
    walletId: number,
    add: number, // Add/Remove denominations
    denominations?: TransactionDenomination[] | CreateTransactionDenomination[] | null
  ): PromiseResult<void> => {
    if (!denominations) {
      return Result.Ok();
    }

    // Update wallet denominations
    const walletDenominationsResult = await walletDenominationRepo
      .getByWalletId(client, walletId);
    if (walletDenominationsResult.isError())
      return walletDenominationsResult.toError();
    const walletDenominations = walletDenominationsResult.getValue();

    for (const td of denominations) {
      const walletDenomination = walletDenominations.find(
        wd => wd.denominationId === td.denominationId
      );

      if (!walletDenomination) {
        const count = add * td.count;
        if (count < 0) {
          return Result.Error({
            code: "USE_CASE_DENOMINATION_NEGATIVE_COUNT",
            data: {
              // Might need a formatter
              amount: (await denominationRepo.getById(client, td.denominationId))
                .orElse(error => {
                  logger.warn("Could not get currency amount for id ", td.denominationId, error);
                  return {
                    id: 0,
                    currencyId: "",
                    amount: 0,
                  };
                }).amount / 100,
            },
          });
        }

        // Insert new denomination value
        walletDenominationRepo.create(client, {
          walletId: walletId,
          denominationId: td.denominationId,
          count,
        });
        continue;
      }

      walletDenomination.count += add * td.count;

      if (walletDenomination.count > 0) {
        // Update existing wallet denomination
        const updateResult = await walletDenominationRepo
          .update(client, walletDenomination);
        if (updateResult.isError()) return updateResult.toError();
        continue;
      }

      // Remove denomination
      if (walletDenomination.count === 0) {
        const removeResult = await walletDenominationRepo.removeByIds(
          client, walletId, td.denominationId
        );
        if (removeResult.isError()) return removeResult.toError();
        continue;
      }

      // Count can't be negative
      return Result.Error({
        code: "USE_CASE_DENOMINATION_NEGATIVE_COUNT",
        data: {
          // Might need a formatter
          amount: (await denominationRepo.getById(client, td.denominationId))
            .orElse(error => {
              logger.warn("Could not get currency amount for id ", td.denominationId, error);
              return {
                id: 0,
                currencyId: "",
                amount: 0,
              };
            }).amount / 100,
        },
      });
    }

    return Result.Ok();
  }

  // === Removing Logic === //

  const removeExpense = async (client: DatabaseClient, transaction: Transaction): PromiseResult<{
    sourceWallet: Wallet;
  }> => {
    const getWalletResult = await walletRepo.getById(client, transaction.walletSourceId);
    if (getWalletResult.isError()) return getWalletResult.toError();
    const sourceWallet = getWalletResult.getValue();
    sourceWallet.amount += transaction.amount;

    if (sourceWallet.hasDenomination) {
      const transactionDenominationsResult = await transactionDenominationRepo
        .getByTransactionId(client, transaction.id);
      if (transactionDenominationsResult.isError())
        return transactionDenominationsResult.toError();

      const walletDenominationsResult = await handleWalletDenominations(
        client, sourceWallet.id, ADD, transactionDenominationsResult.getValue()
      );
      if (walletDenominationsResult.isError())
        return walletDenominationsResult.toError();
    }

    // Automatically removes the attached transaction
    const removeResult = await transactionRepo.removeById(client, transaction.id);
    if (removeResult.isError()) return removeResult.toError();

    const sourceWalletResult = await walletRepo.update(client, sourceWallet);
    if (sourceWalletResult.isError()) return sourceWalletResult.toError();

    return Result.Ok({
      sourceWallet: sourceWalletResult.getValue(),
    });
  };

  const removeIncome = async (client: DatabaseClient, transaction: Transaction): PromiseResult<{
    sourceWallet: Wallet;
  }> => {
    const getWalletResult = await walletRepo.getById(client, transaction.walletSourceId);
    if (getWalletResult.isError()) return getWalletResult.toError();
    const sourceWallet = getWalletResult.getValue();
    sourceWallet.amount -= transaction.amount;

    if (sourceWallet.hasDenomination) {
      const transactionDenominationsResult = await transactionDenominationRepo
        .getByTransactionId(client, transaction.id);
      if (transactionDenominationsResult.isError())
        return transactionDenominationsResult.toError();

      const walletDenominationsResult = await handleWalletDenominations(
        client, sourceWallet.id, REMOVE, transactionDenominationsResult.getValue()
      );
      if (walletDenominationsResult.isError())
        return walletDenominationsResult.toError();
    }

    const removeResult = await transactionRepo.removeById(client, transaction.id);
    if (removeResult.isError()) return removeResult.toError();

    const sourceWalletResult = await walletRepo.update(client, sourceWallet);
    if (sourceWalletResult.isError()) return sourceWalletResult.toError();

    return Result.Ok({
      sourceWallet: sourceWalletResult.getValue(),
    });
  }

  const removeTransfer = async (client: DatabaseClient, transaction: Transaction): PromiseResult<{
    sourceWallet: Wallet;
    destinationWallet: Wallet;
  }> => {
    const getWalletResult = await walletRepo.getById(client, transaction.walletSourceId);
    if (getWalletResult.isError()) return getWalletResult.toError();
    const sourceWallet = getWalletResult.getValue();

    const getDestinationWalletResult = await walletRepo
      .getById(client, transaction.walletDestinationId!);
    if (getDestinationWalletResult.isError()) return getDestinationWalletResult.toError();
    const destinationWallet = getDestinationWalletResult.getValue();

    sourceWallet.amount += transaction.amount;
    destinationWallet.amount -= transaction.amount;

    // Wallet Denomination Updates
    if (sourceWallet.hasDenomination || destinationWallet.hasDenomination) {
      const transactionDenominationsResult = await transactionDenominationRepo
        .getByTransactionId(client, transaction.id);
      if (transactionDenominationsResult.isError())
        return transactionDenominationsResult.toError();

      if (sourceWallet.hasDenomination) {
        const sourceDenominationsResult = await handleWalletDenominations(
          client, sourceWallet.id, ADD, transactionDenominationsResult.getValue()
        );
        if (sourceDenominationsResult.isError())
          return sourceDenominationsResult.toError();
      }

      if (destinationWallet.hasDenomination) {
        const destinationDenominationsResult = await handleWalletDenominations(
          client, destinationWallet.id, REMOVE, transactionDenominationsResult.getValue()
        );
        if (destinationDenominationsResult.isError())
          return destinationDenominationsResult.toError();
      }
    }

    const removeResult = await transactionRepo.removeById(client, transaction.id);
    if (removeResult.isError()) return removeResult.toError();

    const sourceWalletResult = await walletRepo.update(client, sourceWallet);
    if (sourceWalletResult.isError()) return sourceWalletResult.toError();

    const destinationWalletResult = await walletRepo.update(client, destinationWallet);
    if (destinationWalletResult.isError()) return destinationWalletResult.toError();

    return Result.Ok({
      sourceWallet: sourceWalletResult.getValue(),
      destinationWallet: destinationWalletResult.getValue(),
    });
  }

  return {
    getTransactionsByWallet: async (walletId, pagination): PromiseResult<Transaction[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return transactionRepo.getByWalletId(client, walletId, pagination);
      } finally {
        await client.close();
      }
    },

    createExpense: async (transaction) => {
      transaction.type = TransactionType.EXPENSE; // Force to be a expense transaction

      const validateResult = validateCreateTransaction(transaction);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          const getResult = await walletRepo.getById(client, transaction.walletSourceId);
          if (getResult.isError()) return getResult.toError();

          const wallet = getResult.getValue();
          const calculateAmountResult = await calculateAmount(client, transaction, wallet.currencyId);
          if (calculateAmountResult.isError()) return calculateAmountResult.toError();

          transaction.amount = calculateAmountResult.getValue();
          wallet.amount -= transaction.amount;

          const transactionResult = await transactionRepo.create(client, transaction);
          if (transactionResult.isError()) return transactionResult.toError();
          const createdTransaction = transactionResult.getValue();

          const walletResult = await walletRepo.update(client, wallet);
          if (walletResult.isError()) return walletResult.toError();

          const transactionDenominationsResult = await handleDenominations(
            client, createdTransaction.id, transaction
          );
          if (transactionDenominationsResult.isError())
            return transactionDenominationsResult.toError();

          const walletDenominationsResult = await handleWalletDenominations(
            client, wallet.id, REMOVE, transaction.denominations
          );
          if (walletDenominationsResult.isError())
            return walletDenominationsResult.toError();

          return Result.Ok({
            transaction: createdTransaction,
            wallet: walletResult.getValue(),
            transactionDenominations: transactionDenominationsResult.getValue(),
          });
        });
      } finally {
        await client.close();
      }
    },

    createIncome: async (transaction) => {
      transaction.type = TransactionType.INCOME; // Force to be a income transaction

      const validateResult = validateCreateTransaction(transaction);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          const getResult = await walletRepo.getById(client, transaction.walletSourceId);
          if (getResult.isError()) return getResult.toError();

          const wallet = getResult.getValue();
          const calculateAmountResult = await calculateAmount(client, transaction, wallet.currencyId);
          if (calculateAmountResult.isError()) return calculateAmountResult.toError();

          transaction.amount = calculateAmountResult.getValue();
          wallet.amount += transaction.amount;

          const transactionResult = await transactionRepo.create(client, transaction);
          if (transactionResult.isError()) return transactionResult.toError();
          const createdTransaction = transactionResult.getValue();

          const walletResult = await walletRepo.update(client, wallet);
          if (walletResult.isError()) return walletResult.toError();

          const transactionDenominationsResult = await handleDenominations(
            client, createdTransaction.id, transaction
          );
          if (transactionDenominationsResult.isError())
            return transactionDenominationsResult.toError();

          const walletDenominationsResult = await handleWalletDenominations(
            client, wallet.id, ADD, transaction.denominations
          );
          if (walletDenominationsResult.isError())
            return walletDenominationsResult.toError();

          return Result.Ok({
            transaction: createdTransaction,
            wallet: walletResult.getValue(),
            transactionDenominations: transactionDenominationsResult.getValue(),
          });
        });
      } finally {
        await client.close();
      }
    },

    createTransfer: async (transaction) => {
      transaction.type = TransactionType.TRANSFER; // Force to be a transfer transaction

      const validateResult = validateCreateTransaction(transaction);
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

          // NOTE: Only supports same currency wallets for now
          if (sourceWallet.currencyId !== destinationWallet.currencyId) {
            return Result.Error({ code: "UNKNOWN" });
          }

          const calculateAmountResult = await calculateAmount(client, transaction, sourceWallet.currencyId);
          if (calculateAmountResult.isError()) return calculateAmountResult.toError();
          transaction.amount = calculateAmountResult.getValue();

          sourceWallet.amount -= transaction.amount;
          destinationWallet.amount += transaction.amount;

          // Transaction Changes
          const transactionResult = await transactionRepo.create(client, transaction);
          if (transactionResult.isError()) return transactionResult.toError();
          const createdTransaction = transactionResult.getValue();

          const transactionDenominationsResult = await handleDenominations(
            client, createdTransaction.id, transaction
          );
          if (transactionDenominationsResult.isError())
            return transactionDenominationsResult.toError();

          // Source Wallet Changes
          const sourceWalletResult = await walletRepo.update(client, sourceWallet);
          if (sourceWalletResult.isError()) return sourceWalletResult.toError();
          if (sourceWallet.hasDenomination) {
            const sourceDenominationsResult = await handleWalletDenominations(
              client, sourceWallet.id, REMOVE, transaction.denominations
            );
            if (sourceDenominationsResult.isError())
              return sourceDenominationsResult.toError();
          }

          // Destination Wallet Changes
          const destinationWalletResult = await walletRepo.update(client, destinationWallet);
          if (destinationWalletResult.isError()) return destinationWalletResult.toError();
          if (destinationWallet.hasDenomination) {
            const destinationDenominationsResult = await handleWalletDenominations(
              client, destinationWallet.id, ADD, transaction.denominations
            );
            if (destinationDenominationsResult.isError())
              return destinationDenominationsResult.toError();
          }

          return Result.Ok({
            transaction: createdTransaction,
            sourceWallet: sourceWalletResult.getValue(),
            destinationWallet: destinationWalletResult.getValue(),
            transactionDenominations: transactionDenominationsResult.getValue(),
          });
        });
      } finally {
        await client.close();
      }
    },

    removeTransaction: async (transactionId) => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          const getTransactionResult = await transactionRepo.getById(client, transactionId);
          if (getTransactionResult.isError()) return getTransactionResult.toError();
          const transaction = getTransactionResult.getValue();

          switch (transaction.type) {
          case TransactionType.EXPENSE:
            return await removeExpense(client, transaction);

          case TransactionType.INCOME:
            return await removeIncome(client, transaction);

          case TransactionType.TRANSFER:
            return await removeTransfer(client, transaction);

          default:
            return Result.Error({ code: "UNKNOWN" });
          }
        });
      } finally {
        await client.close();
      }
    },
  };
}
