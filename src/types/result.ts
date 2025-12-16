import { ErrorCodes, ErrorData } from "./error";

export type ResultError<E extends ErrorCodes> = (ErrorData<E> extends undefined ? {
  code: E;
  error?: Error;
} : {
  code: E;
  error?: Error;
  data: ErrorData<E>;
});

export class Result<T> {
  private value?: T;
  private error?: ResultError<any>;

  static Ok<T2 = void>(value?: T2): Result<T2> {
    return new Result<T2>(value, undefined);
  }

  static Error<T2, E extends ErrorCodes>(error: ResultError<E>): Result<T2> {
    if (!error.error) {
      error.error = new Error(error.code);
    }

    return new Result<T2>(undefined, error);
  }

  private constructor(value: T | undefined, error: ResultError<any> | undefined) {
    this.value = value;
    this.error = error;
  }

  isOk() {
    return !this.error;
  }

  isError() {
    return Boolean(this.error);
  }

  getValue(): T {
    if (process.env.NODE_ENV === "development") {
      if (this.isError()) {
        throw new Error("Dev Error: isError when getValue() called");
      }
    }

    return this.value as T;
  }

  getValueOr(val: T): T {
    return this.isError() ? val : this.value as T;
  }

  getError() {
    if (process.env.NODE_ENV === "development") {
      if (this.isOk()) {
        throw new Error("Dev Error: isOk when getError() called");
      }
    }

    return this.error;
  }

  orElse(handler: (error: any) => T): T {
    return this.isOk() ? this.value as T : handler(this.error);
  }

  toError<T2 = void>(): Result<T2> {
    return this as any;
  }

}

export type PromiseResult<T = void> = Promise<Result<T>>;
