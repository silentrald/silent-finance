<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { AppLocale } from "@/types";
import locale from "@/modules/locale";
import logger from "@/modules/logger";
import preferences from "@/modules/preferences";
import useLocale from "@/composables/locale";

const { t } = useLocale();
const language = ref("" as AppLocale);

onMounted(async () => {
  const languageResult = await preferences.get("locale");
  if (languageResult.isError()) {
    logger.error("Could not get language result from database", languageResult.getError());
    return;
  }

  language.value = languageResult.getValue();
});

async function onLanguageChanged() {
  let result = await preferences.set("locale", language.value);
  if (result.isError()) {
    logger.error(
      "Could not change locale to ",
      language.value, result.getError()
    );
    language.value = locale.current();
    return;
  }

  result = await locale.set(language.value);
  if (result.isError()) {
    logger.error(
      "Could not set locale to ",
      language.value, result.getError()
    );
    return;
  }
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ t("settings.title") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t("settings.title") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-select
          v-model="language"
          :label="t('settings.language')"
          :ok-text="t('general.ok')"
          :cancel-text="t('general.cancel')"
          @ion-change="onLanguageChanged"
        >
          <ion-select-option v-for="l in locale.availableLocales()"
            :key="l.locale"
            :value="l.locale"
          >
            {{ l.text }}
          </ion-select-option>
        </ion-select>
      </div>
    </ion-content>
  </ion-page>
</template>
