import { PromiseResult } from "./result";

export interface DatabaseClient {
  query<Return>(sql: string, values?: any[]): PromiseResult<Return[]>;
  run(statement: string, values?: any[]): PromiseResult<any>;
  beginTransaction(): PromiseResult<void>;
  commitTransaction(): PromiseResult<void>;
  rollbackTransaction(): PromiseResult<void>;
  close(): PromiseResult<void>;
}

export interface DatabaseService {
  init(): PromiseResult<void>;
  getClient(): PromiseResult<DatabaseClient>;
}
