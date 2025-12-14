
export type Platform = "web" | "android";

export type AppLocale = "en" | "jp";

export interface ValidatorError {
  property: string;
  code: string;
  message: string;
}

