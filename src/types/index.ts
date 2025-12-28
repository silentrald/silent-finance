
export type Platform = "web" | "android";

export type AppLocale = "en" | "ja";

export interface ValidatorError {
  property: string;
  code: string;
  message: string;
}

export type HexColor = `#${string}`;

