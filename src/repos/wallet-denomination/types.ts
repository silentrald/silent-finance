import { CreateWalletDenomination, WalletDenomination } from "@/entities/wallet-denomination";
import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export interface WalletDenominationRepo {
  getByWalletId(client: DatabaseClient, walletId: number): PromiseResult<WalletDenomination[]>;

  create(
    client: DatabaseClient,
    walletDenomination: WalletDenomination
  ): PromiseResult<WalletDenomination>;

  createList(
    client: DatabaseClient,
    walletId: number,
    walletDenominations: CreateWalletDenomination[]
  ): PromiseResult<WalletDenomination[]>;

  update(
    client: DatabaseClient,
    walletDenomination: WalletDenomination
  ): PromiseResult<WalletDenomination>;

  removeByWalletId(client: DatabaseClient, walletId: number): PromiseResult<void>;
  removeByIds(
    client: DatabaseClient,
    walletId: number,
    denominationId: number
  ): PromiseResult<void>;
}
