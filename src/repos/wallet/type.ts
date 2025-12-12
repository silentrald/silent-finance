import { PromiseResult } from "@/types/result";
import { Wallet } from "@/entities/wallet";

export interface WalletRepo {
  getById(walletId: number): PromiseResult<Wallet>;
  getAll(): PromiseResult<Wallet[]>;

  create(wallet: Wallet): PromiseResult<Wallet>;
  update(wallet: Wallet): PromiseResult<Wallet>;

  removeById(walletId: number): PromiseResult<void>;
}
