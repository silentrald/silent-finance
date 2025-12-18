import { Wallet, validateWallet } from "@/entities/wallet";
import { DatabaseService } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";
import { WalletRepo } from "@/repos/wallet/type";
import WalletUseCase from "./types";


export default function createWalletUseCaseV1({
  databaseService,
  walletRepo,
}: {
  databaseService: DatabaseService;
  walletRepo: WalletRepo;
}): WalletUseCase {
  return {
    getAllWallets: async (): PromiseResult<Wallet[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return walletRepo.getAll(client);
      } finally {
        await client.close();
      }
    },

    createWallet: async (wallet): PromiseResult<Wallet> => {
      const validateResult = validateWallet(wallet);
      if (validateResult.isError()) return validateResult.toError();

      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return walletRepo.create(client, wallet);
      } finally {
        await client.close();
      }
    },

    removeWallet: async (walletId): PromiseResult<void> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return walletRepo.removeById(client, walletId);
      } finally {
        await client.close();
      }
    },
  }
}
