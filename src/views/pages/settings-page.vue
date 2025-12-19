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
import preferences from "@/modules/preferences";
import useLocale from "@/composables/locale";
import useToast from "@/composables/toast";

const { t } = useLocale();
const toast = useToast();

const language = ref("" as AppLocale);

onMounted(async () => {
  const languageResult = await preferences.get("locale");
  if (languageResult.isError()) {
    await toast.error({ error: languageResult.getError()! });
    return;
  }

  language.value = languageResult.getValue();
});

async function onLanguageChanged(newLanguage: AppLocale) {
  let result = await preferences.set("locale", newLanguage);
  if (result.isError()) {
    await toast.error({
      message: `Can't change locale to ${newLanguage}`,
      error: result.getError()!,
    });
    language.value = locale.current();
    return;
  }

  result = await locale.set(newLanguage);
  if (result.isError()) {
    await toast.error({
      message: `Can't change locale to ${newLanguage}`,
      error: result.getError()!,
    });
    return;
  }

  language.value = newLanguage;
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
          :value="language"
          :label="t('settings.language')"
          :ok-text="t('general.ok')"
          :cancel-text="t('general.cancel')"
          @ion-change="onLanguageChanged($event.detail.value as AppLocale)"
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
