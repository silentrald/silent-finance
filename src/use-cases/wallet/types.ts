import { PromiseResult } from "@/types/result";
import { Wallet } from "@/entities/wallet";

export default interface WalletUseCase {
  getAllWallets(): PromiseResult<Wallet[]>;
  createWallet(wallet: Wallet): PromiseResult<Wallet>;
  removeWallet(walletId: number): PromiseResult<void>;
}
