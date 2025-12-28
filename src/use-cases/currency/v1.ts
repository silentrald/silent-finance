import { Currency } from "@/entities/currency";
import { CurrencyRepo } from "@/repos/currency/types";
import CurrencyUseCase from "./types";
import { DatabaseService } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export default function createCurrencyUseCaseV1({
  databaseService,
  currencyRepo,
}: {
  databaseService: DatabaseService;
  currencyRepo: CurrencyRepo;
}): CurrencyUseCase {
  return {
    getAllCurrencies: async (): PromiseResult<Currency[]> => {
      const clientResult = await databaseService.getClient();
      if (clientResult.isError()) return clientResult.toError();
      const client = clientResult.getValue();

      try {
        return await currencyRepo.getAll(client);
      } finally {
        await client.close();
      }
    },
  };
}
