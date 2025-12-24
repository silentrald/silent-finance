import { AppLocale } from "@/types";
import LocaleSchema from "@/locales/types";
import { useI18n } from "vue-i18n";


type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)];

export default function useLocale() {
  const i18n = useI18n();

  return {
    t: (key: NestedKeyOf<LocaleSchema>, parameters: Record<string, string> = {}): string =>
      i18n.t(key, parameters),

    n: (num: number, format: string = "default", locale?: AppLocale): string =>
      i18n.n(num, format, locale || "en"),

    // format money
    m: (num: number, locale?: AppLocale): string =>
      i18n.n(num / 100, "money", locale || "en"),
  };
}
