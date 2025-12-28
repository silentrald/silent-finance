import { PromiseResult } from "@/types/result";

export interface DatabaseClient {
  query<Return>(sql: string, values?: any[]): PromiseResult<Return[]>;
  run(statement: string, values?: any[]): PromiseResult<{
    changes: number;
  }>;
  // If being returned from a function, please do "return await client.transaction<>()",
  // to avoid issue with variables not existing anymore
  transaction<T>(handler: () => PromiseResult<T>): PromiseResult<T>;
  isTransaction(): boolean;
  close(): PromiseResult<void>;
}

export interface DatabaseService {
  init(): PromiseResult<void>;
  getClient(): PromiseResult<DatabaseClient>;
}
