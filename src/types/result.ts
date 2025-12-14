export class Result<T> {
  private value?: T;
  // TODO: Check what is the best return for this
  private error?: any;

  static Ok<T2 = void>(value?: T2): Result<T2> {
    return new Result<T2>(value, undefined);
  }

  static Error<T2>(error: any): Result<T2> {
    return new Result<T2>(undefined, error);
  }

  private constructor(value: T | undefined, error: any) {
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
