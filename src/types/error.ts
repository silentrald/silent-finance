import { ValidatorError } from "./index";

interface ErrorInterface {
  // Database
  DATABASE_INIT: undefined;
  DATABASE_GET_CLIENT: undefined;
  DATABASE_QUERY: undefined;
  DATABASE_RUN: undefined;
  DATABASE_BEGIN_TRANSACTION: undefined;
  DATABASE_COMMIT_TRANSACTION: undefined;
  DATABASE_ROLLBACK_TRANSACTION: undefined;
  DATABASE_CLOSE: undefined;

  // Modules
  ENTITY_INVALID: ValidatorError[];

  LOCALE_INIT: undefined;
  LOCALE_UNINITIALIZED: undefined;
  LOCALE_SET: undefined;

  SHOW_MODAL: undefined;
  PREFERENCE_SET: { key: string; value: string; };
  PREFERENCE_GET: { key: string; };

  // Repos
  REPO_NO_UPDATE: { table: string; };
  REPO_NO_REMOVE: { table: string; };

  REPO_MISSING_ID: { table: string; };

  UNKNOWN: undefined;
}

export type ErrorCodes = keyof ErrorInterface;
export type ErrorData<Key extends ErrorCodes> = ErrorInterface[Key];

