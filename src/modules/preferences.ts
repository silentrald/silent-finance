/**
 * Simple data storage for mobile devices.
 * - SharedPreferences for Android
 **/

import { PromiseResult, Result } from "@/types/result";
import { AppLocale } from "@/types";
import { Preferences } from "@capacitor/preferences";

const preferenceDefaults = {
  locale: "en" as AppLocale,
};

type PreferenceKey = typeof preferenceDefaults;

const preferences = {
  set: async <Key extends keyof PreferenceKey>(key: Key, value: PreferenceKey[Key]) => {
    try {
      await Preferences.set({ key, value, });
      return Result.Ok();
    } catch (error) {
      return Result.Error(error);
    }
  },

  get: async <Key extends keyof PreferenceKey>(key: Key): PromiseResult<PreferenceKey[Key]> => {
    try {
      const { value, } = await Preferences.get({ key, });
      return Result.Ok((value || preferenceDefaults[key]) as PreferenceKey[Key]);
    } catch (error) {
      return Result.Error(error);
    }
  },
};

export default preferences;
