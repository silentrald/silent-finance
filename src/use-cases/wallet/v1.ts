import { DatabaseService } from "@/modules/database/type";
import { DenominationRepo } from "@/repos/denomination/types";
import { Result } from "@/types/result";
import { WalletDenomination } from "@/entities/wallet-denomination";
import { WalletDenominationRepo } from "@/repos/wallet-denomination/types";
import { WalletRepo } from "@/repos/wallet/type";
import WalletUseCase from "./types";
import { validateCreateWallet } from "@/entities/wallet";

export default function createWalletUseCaseV1({
  databaseService,
  walletRepo,
  denominationRepo,
  walletDenominationRepo,
}: {
  databaseService: DatabaseService;
  walletRepo: WalletRepo;
  denominationRepo: DenominationRepo;
  walletDenominationRepo: WalletDenominationRepo;
}): WalletUseCase {
  return {
    getAllWallets: async () => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await walletRepo.getAll(client);
      } finally {
        await client.close();
      }
    },

    createWallet: async (wallet) => {
      const validateResult = validateCreateWallet(wallet);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await client.transaction(async () => {
          if (wallet.denominations) {
            wallet.amount = 0;

            const denominationsResult = await denominationRepo
              .getByCurrencyId(client, wallet.currencyId);
            if (denominationsResult.isError())
              return denominationsResult.toError();
            const denominations = denominationsResult.getValue();

            for (const wd of wallet.denominations) {
              const d = denominations.find(d => d.id === wd.denominationId);
              if (!d) {
                return Result.Error({
                  code: "NOT_FOUND",
                  data: { entity: "walletDenomination" },
                });
              }
              wd.count = Math.max(0, wd.count);
              wallet.amount += wd.count * d.amount;
            }
          }

          const walletResult = await walletRepo.create(client, wallet);
          if (walletResult.isError()) return walletResult.toError();
          const createdWallet = walletResult.getValue();

          let createdWalletDenominations: WalletDenomination[] = [];
          if (wallet.denominations) {
            const walletDenominationsResult = await walletDenominationRepo.createList(
              client,
              createdWallet.id,
              wallet.denominations
            );
            if (walletDenominationsResult.isError())
              return walletDenominationsResult.toError();

            createdWalletDenominations = walletDenominationsResult.getValue();
          }

          return Result.Ok({
            wallet: createdWallet,
            walletDenominations: createdWalletDenominations,
          });
        });
      } finally {
        await client.close();
      }
    },

    removeWallet: async (walletId) => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await walletRepo.removeById(client, walletId);
      } finally {
        await client.close();
      }
    },
  }
}
