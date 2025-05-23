import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, I18nManager } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/i18n';
import { AuthProvider } from '~/context/AuthContext';
import { AuthGuard } from '~/components/AuthGuard';
import { useLanguageStore } from '~/lib/store';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { language } = useLanguageStore();

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    
    // Set RTL based on language
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
    
    // Apply language
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          <AuthGuard>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ClubDetails"
                options={{
                  title: 'Club Details',
                  headerRight: () => <ThemeToggle />,
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  title: 'Login',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="register"
                options={{
                  title: 'Register',
                  headerShown: false,
                }}
              />
            </Stack>
            <PortalHost />
          </AuthGuard>
        </ThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
