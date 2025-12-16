import { Wallet, validateWallet } from "@/entities/wallet";
import { PromiseResult } from "@/types/result";
import { WalletRepo } from "@/repos/wallet/type";
import WalletUseCase from "./types";


export default function createWalletUseCaseV1({
  walletRepo,
}: {
  walletRepo: WalletRepo;
}): WalletUseCase {
  return {
    getAllWallets: async (): PromiseResult<Wallet[]> => {
      return walletRepo.getAll();
    },

    createWallet: async (wallet): PromiseResult<Wallet> => {
      const validateResult = validateWallet(wallet);
      if (validateResult.isError()) return validateResult.toError();
      return walletRepo.create(wallet);
    },

    removeWallet: async (walletId): PromiseResult<void> => {
      return walletRepo.removeById(walletId);
    },
  }
}
