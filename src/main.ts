/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import "@ionic/vue/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import App from "./App.vue";
import { AppLocale } from "./types";
import { IonicVue } from "@ionic/vue";
import { createApp } from "vue";
import createSQLite3DatabaseService from "./modules/database/sqlite3";
import locale from "./modules/locale";
import logger from "./modules/logger";
import preferences from "./modules/preferences";
import router from "./router";
import { setupRepos } from "./repos";

window.addEventListener("DOMContentLoaded", async () => {
  logger.info("Starting");

  const databaseService = createSQLite3DatabaseService({
    databaseName: "silent_finance",
    version: 1,
    encryptionSecret: "no-encryption",
  });
  await databaseService.init();

  const app = createApp(App)
    .use(IonicVue)
    .use(router);

  setupRepos({ app, databaseService });

  const localePrefs: AppLocale = (await preferences.get("locale"))
    .orElse(error => {
      logger.error("Could not get locale preferences value", error);
      return "en";
    });
  const result = await locale.init(app, localePrefs);
  if (result.isError()) {
    logger.error("Could not initialize locales", result.getError());
  }

  await router.isReady();
  app.mount("#app");
});
