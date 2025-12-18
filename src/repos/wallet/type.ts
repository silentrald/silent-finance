import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";
import { Wallet } from "@/entities/wallet";

export interface WalletRepo {
  getById(client: DatabaseClient, walletId: number): PromiseResult<Wallet>;
  getAll(client: DatabaseClient): PromiseResult<Wallet[]>;

  create(client: DatabaseClient, wallet: Wallet): PromiseResult<Wallet>;
  update(client: DatabaseClient, wallet: Wallet): PromiseResult<Wallet>;

  removeById(client: DatabaseClient, walletId: number): PromiseResult<void>;
}
