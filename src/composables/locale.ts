import { AppLocale } from "@/types";
import LocaleSchema from "@/locales/types";
import locale from "@/modules/locale";
import { useI18n } from "vue-i18n";


const LOCALES: {
  locale: AppLocale;
  text: string;
}[] = [
  { locale: "en", text: "English", },
  { locale: "jp", text: "日本語", }
];

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object 
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)];

export default function useLocale() {
  const i18n = useI18n();

  return {
    t: (key: NestedKeyOf<LocaleSchema>, parameters: Record<string, string> = {}) => i18n.t(key, parameters),

    async setLocale(appLocale: AppLocale) {
      return locale.set(appLocale);
    },

    availableLocales() {
      return LOCALES;
    },

    currentLocale() {
      return locale.current();
    },
  };
}
