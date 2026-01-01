
export type Platform = "web" | "android";

export type AppLocale = "en" | "ja";

export interface ValidatorError {
  property: string;
  code: string;
  message: string;
}

export type HexColor = `#${string}`;

export interface Pagination {
  page: number; // Which page to load, 1 index instead of 0
  items: number; // How many items for a single page
}

