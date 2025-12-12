import { I18n, createI18n } from "vue-i18n";
import { App } from "vue";
import { AppLocale } from "@/types";

let i18n: I18n;

async function loadLocale(locale: AppLocale) {
  const messages = await import(`../locales/${locale}.ts`);

  i18n.global.setLocaleMessage(locale, messages.default);
}

function setLocaleImpl(locale: AppLocale) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  } 
  document.querySelector("html")?.setAttribute("lang", locale);
}

export default {
  async init(app: App, locale: AppLocale) {
    i18n = createI18n({
      locale,
      fallbackLocale: "en",
    });
  
    await loadLocale(locale);
    setLocaleImpl(locale);
  
    const messages = await import(`../locales/${locale}.ts`);
    i18n.global.setLocaleMessage(locale, messages.default);
  
    app.use(i18n);
  },

  async set(locale: AppLocale) {
    if (!i18n) {
      return;
    }
  
    if (!i18n.global.availableLocales.includes(locale)) {
      await loadLocale(locale);
    }
    setLocaleImpl(locale);
  },

  current() {
    if (!i18n) {
      return "en";
    }

    return i18n.mode === "legacy"
      ? i18n.global.locale
      : (i18n.global.locale as any).value;
  },
}
