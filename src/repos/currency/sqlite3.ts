import { Currency } from "@/entities/currency";
import { CurrencyRepo } from "./types";
import { PromiseResult } from "@/types/result";
import { Tables } from "@/db/consts";

export default function createCurrencyRepoSQLite3(): CurrencyRepo {
  return {
    getAll: async (client): PromiseResult<Currency[]> => {
      return await client.query<Currency>(
        `SELECT * FROM ${Tables.CURRENCY};`
      );
    },
  }
}
