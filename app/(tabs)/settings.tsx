import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '~/lib/useColorScheme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { Switch } from '~/components/ui/switch';
import { NAV_THEME } from '~/lib/constants';
import { Card } from '~/components/ui/card';
import { I18nManager } from 'react-native';
import { useLanguageStore } from '~/lib/store';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const { language, setLanguage } = useLanguageStore();
  
  const toggleTheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  };

  const toggleLanguage = async () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    await setLanguage(newLang);
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-foreground mb-6">
        {t('settings.title', 'Settings')}
      </Text>

      <Card className="p-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-foreground text-base font-medium">
            {t('settings.darkMode', 'Dark Mode')}
          </Text>
          <Switch 
            checked={isDarkColorScheme}
            onCheckedChange={toggleTheme}
          />
        </View>
        <Text className="text-muted-foreground text-sm">
          {t('settings.darkModeDescription', 'Switch between light and dark themes')}
        </Text>
      </Card>

      <Card className="p-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-foreground text-base font-medium">
            {t('settings.language', 'Language')}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-foreground text-sm mr-2">
              {language === 'ar' ? 'العربية' : 'English'}
            </Text>
            <Switch 
              checked={language === 'en'}
              onCheckedChange={toggleLanguage}
            />
          </View>
        </View>
        <Text className="text-muted-foreground text-sm">
          {t('settings.languageDescription', 'Change the application language')}
        </Text>
      </Card>
    </ScrollView>
  );
}
