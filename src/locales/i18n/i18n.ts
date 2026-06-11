import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import { storage } from '@/storage/mmkv';

const LANGUAGE_KEY = 'APP_LANGUAGE';

export const getStoredLanguage = (): string => {
  try {
    const lang = storage.getString(LANGUAGE_KEY);
    return lang || 'ar';
  } catch {
    return 'ar';
  }
};

export const saveLanguage = (lang: string) => {
  try {
    storage.set(LANGUAGE_KEY, lang);
  } catch {}
};

export const changeLanguage = async (lang: string) => {
  const isRTL = lang === 'ar';
  await i18n.changeLanguage(lang);
  saveLanguage(lang);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    RNRestart?.restart();
  }
};

const savedLang = getStoredLanguage();
const shouldBeRTL = savedLang === 'ar';

// forceRTL changes isRTL immediately but the actual layout direction only takes
// effect after a restart. If they're out of sync (e.g. first install where the
// default language is Arabic), restart once so the layout matches the language.
if (I18nManager.isRTL !== shouldBeRTL) {
  I18nManager.forceRTL(shouldBeRTL);
  RNRestart?.restart();
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng:         savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;