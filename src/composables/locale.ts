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
    t: (key: NestedKeyOf<LocaleSchema>, parameters: Record<string, string> = {}) => i18n.t(key, parameters),
  };
}
