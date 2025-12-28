import { AmountCount } from "@/dtos/denomination";
import { DatabaseService } from "@/modules/database/type";
import { DenominationRepo } from "@/repos/denomination/types";
import DenominationUseCase from "./types";
import { Result } from "@/types/result";
import { WalletDenominationRepo } from "@/repos/wallet-denomination/types";
import { WalletRepo } from "@/repos/wallet/type";

export default function createDenominationUseCaseV1({
  databaseService,
  denominationRepo,
  walletRepo,
  walletDenominationRepo,
}: {
  databaseService: DatabaseService;
  denominationRepo: DenominationRepo;
  walletRepo: WalletRepo;
  walletDenominationRepo: WalletDenominationRepo;
}): DenominationUseCase {
  return {
    getDenominationsByCurrencyId: async (currencyId) => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await denominationRepo.getByCurrencyId(client, currencyId);
      } finally {
        await client.close();
      }
    },

    getAmountCountOfWallet: async (walletId) => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        const walletResult = await walletRepo.getById(client, walletId);
        if (walletResult.isError()) return walletResult.toError();
        const wallet = walletResult.getValue();

        const denominationsResult = await denominationRepo
          .getByCurrencyId(client, wallet.currencyId);
        if (denominationsResult.isError()) return denominationsResult.toError();
        const denominations = denominationsResult.getValue();

        const walletDenominationResult = await walletDenominationRepo
          .getByWalletId(client, walletId);
        if (walletDenominationResult.isError())
          return walletDenominationResult.toError();
        const walletDenominations = walletDenominationResult.getValue();

        const output: AmountCount[] = [];

        for (const wd of walletDenominations) {
          const d = denominations.find(d => d.id === wd.denominationId);
          if (!d) {
            continue;
          }

          output.push({
            amount: d.amount,
            count: wd.count,
          });
        }

        return Result.Ok(output);
      } finally {
        await client.close();
      }
    },
  }
}
