import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
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
  I18nManager.forceRTL(isRTL);
  await i18n.changeLanguage(lang);
  saveLanguage(lang);
};

const savedLang = getStoredLanguage();
I18nManager.forceRTL(savedLang === 'ar');

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