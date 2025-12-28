import { CreateWallet, Wallet } from "@/entities/wallet";
import { PromiseResult } from "@/types/result";
import { WalletDenomination } from "@/entities/wallet-denomination";

export default interface WalletUseCase {
  getAllWallets(): PromiseResult<Wallet[]>;

  createWallet(wallet: CreateWallet): PromiseResult<{
    wallet: Wallet;
    walletDenominations: WalletDenomination[];
  }>;

  removeWallet(walletId: number): PromiseResult<void>;
}
