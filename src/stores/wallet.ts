import { CreateWallet, Wallet } from "@/entities/wallet";
import { PromiseResult, Result } from "@/types/result";
import { inject, ref } from "vue";
import { UseCases } from "@/use-cases/consts";
import WalletUseCase from "@/use-cases/wallet/types";
import { defineStore } from "pinia";
import logger from "@/modules/logger";

const useWalletStore = defineStore("wallet", () => {
  const wallets = ref([] as Wallet[]);
  const walletMap = ref({} as Record<number, Wallet>);
  const currentWallet = ref(null as Wallet | null);

  const walletUseCase = inject(UseCases.WALLET) as WalletUseCase;

  return {
    getWallets: () => wallets.value,

    getWalletById: (walletId: number) => walletMap.value[walletId],

    getCurrentWallet: () => currentWallet.value,
    setCurrentWallet: (wallet: Wallet | null) => currentWallet.value = wallet,

    updateWallet: (wallet: Wallet): void => {
      if (!walletMap.value[wallet.id!]) {
        return;
      }

      const index = wallets.value.findIndex(w => w.id === wallet.id)
      wallets.value[index] = wallet;
      walletMap.value[wallet.id!] = wallet;
    },

    loadWallets: async (): PromiseResult<void> => {
      const walletsResult = await walletUseCase.getAllWallets();
      if (walletsResult.isError()) return walletsResult.toError();

      const _wallets = walletsResult.getValue();
      if (_wallets.length === 0) return Result.Ok();

      wallets.value = _wallets;
      for (const w of _wallets) {
        walletMap.value[w.id!] = w;
      }
      currentWallet.value = _wallets[0];

      logger.debug("Initialized wallets");
      return Result.Ok();
    },

    createWallet: async (wallet: CreateWallet): PromiseResult<Wallet> => {
      const result = await walletUseCase.createWallet(wallet);
      if (result.isError()) return result.toError();

      const { wallet: newWallet } = result.getValue();
      logger.debug("UwU created", newWallet);
      wallets.value.push(newWallet);
      walletMap.value[newWallet.id] = newWallet;
      if (!currentWallet.value) {
        currentWallet.value = newWallet;
      }

      return Result.Ok(newWallet);
    },

    removeWallet: async (walletId: number): PromiseResult<void> => {
      const result = await walletUseCase.removeWallet(walletId);
      if (result.isError()) return result.toError();

      wallets.value.splice(wallets.value.findIndex(w => w.id === walletId), 1);
      delete walletMap.value[walletId];

      if (currentWallet.value?.id === walletId) {
        currentWallet.value = wallets.value.length > 0
          ? wallets.value[0]
          : null;
      }

      return Result.Ok();
    },
  };
});

export default useWalletStore;
