import { Currency } from "@/entities/currency";
import { DatabaseClient } from "@/modules/database/type";
import { PromiseResult } from "@/types/result";

export interface CurrencyRepo {
  getAll(client: DatabaseClient): PromiseResult<Currency[]>;
}
