// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

import en from './en.json';
import ar from './ar.json';

// Get the system locale using the recommended getLocales() method
const locales = Localization.getLocales();
const systemLocale = locales.length > 0 ? locales[0].languageCode : 'ar';

// Determine the language to use
// Use system language if it's English or Arabic, otherwise default to Arabic
const languageToUse = systemLocale === 'en' ? 'en' : 'ar';

// Enable RTL layout for Arabic
I18nManager.allowRTL(true);
// Force RTL for Arabic language
if (languageToUse === 'ar') {
  I18nManager.forceRTL(true);
}

i18n.use(initReactI18next).init({
  lng: languageToUse, // Use detected language
  fallbackLng: 'ar', // Fallback to Arabic
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
});

export default i18n;