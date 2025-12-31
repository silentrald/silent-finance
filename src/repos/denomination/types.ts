import { DatabaseClient } from "@/modules/database/type";
import { Denomination } from "@/entities/denomination";
import { PromiseResult } from "@/types/result";

export interface DenominationRepo {
  getById(client: DatabaseClient, denominationId: number): PromiseResult<Denomination>;
  getByCurrencyId(client: DatabaseClient, currencyId: string): PromiseResult<Denomination[]>;
}
