import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '~/i18n';
import { I18nManager } from 'react-native';

type LanguageState = {
  language: 'ar' | 'en';
  setLanguage: (language: 'ar' | 'en') => Promise<void>;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: i18n.language as 'ar' | 'en',
      setLanguage: async (language: 'ar' | 'en') => {
        await i18n.changeLanguage(language);
        
        // Handle RTL layout
        const isRTL = language === 'ar';
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.forceRTL(isRTL);
          // In a real app, we would need to restart the app here
        }
        
        set({ language });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
