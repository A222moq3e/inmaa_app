// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import en from './en.json';
import ar from './ar.json';

// Enable RTL layout for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

i18n.use(initReactI18next).init({
  lng: 'ar', // Set Arabic as default language
  fallbackLng: 'ar',
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
});

export default i18n;