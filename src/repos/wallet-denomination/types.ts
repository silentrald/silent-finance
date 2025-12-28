import { CreateWalletDenomination, WalletDenomination } from "@/entities/wallet-denomination";
import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export interface WalletDenominationRepo {
  getByWalletId(client: DatabaseClient, walletId: number): PromiseResult<WalletDenomination[]>;

  createList(
    client: DatabaseClient,
    walletId: number,
    walletDenominations: CreateWalletDenomination[]
  ): PromiseResult<WalletDenomination[]>;

  removeByWalletId(client: DatabaseClient, walletId: number): PromiseResult<void>;
}
