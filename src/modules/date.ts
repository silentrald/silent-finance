import "dayjs/locale/ja";
import dayjs from "dayjs";
import locale from "./locale";

export function formatDate(date: string, format: string): string {
  return dayjs(date)
    .locale(locale.current())
    .format(format);
}
