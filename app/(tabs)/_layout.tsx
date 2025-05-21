import * as React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { useTranslation } from 'react-i18next';
import { Home, User } from 'lucide-react-native';
import { View } from 'react-native';
import { Settings } from '~/lib/icons/Settings';

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkColorScheme 
          ? NAV_THEME.dark.primary 
          : NAV_THEME.light.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home', 'Home'),
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile', 'Profile'),
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings', 'Settings'),
          tabBarIcon: ({ color }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
