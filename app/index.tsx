import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNav } from '@/context/NavContext';
import { Colors } from '@/constants/Colors';

// Import our page components
import { AboutPage } from '@/components/pages/AboutPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { NotificationsPage } from '@/components/pages/NotificationsPage';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme();
  const { setMenuItems, openDrawer } = useNav();
  
  // Use a ref to track initialization instead of state to avoid re-renders
  const initialized = useRef(false);

  // Memoize the openDrawer callbacks to prevent recreating them on every render
  const openProfile = useCallback(() => {
    openDrawer('Profile', <ProfilePage />);
  }, [openDrawer]);
  
  const openNotifications = useCallback(() => {
    openDrawer('Notifications', <NotificationsPage />);
  }, [openDrawer]);
  
  const openSettings = useCallback(() => {
    openDrawer('Settings', <SettingsPage />);
  }, [openDrawer]);
  
  const openAbout = useCallback(() => {
    openDrawer('About', <AboutPage />);
  }, [openDrawer]);

  // Memoize menuItems to prevent recreating them on every render
  const menuItems = useMemo(() => [
    {
      id: 'profile',
      title: 'My Profile',
      icon: <Ionicons name="person" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuBlue,
      action: openProfile,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Ionicons name="notifications" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuRed,
      action: openNotifications,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Ionicons name="settings" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuGreen,
      action: openSettings,
    },
    {
      id: 'about',
      title: 'About',
      icon: <Ionicons name="information-circle" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuYellow,
      action: openAbout,
    },
  ], [colorScheme, openProfile, openNotifications, openSettings, openAbout]);

  // Set menu items only once using a ref flag
  useEffect(() => {
    // Only set menu items if we haven't done it yet
    if (!initialized.current) {
      setMenuItems(menuItems);
      initialized.current = true;
    }
  }, [setMenuItems, menuItems]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Welcome</Text>
        <Text style={[styles.description, { color: textColor }]}>
          Use the menu button in the bottom left corner to access different sections of the app.
        </Text>
        <View style={styles.iconsContainer}>
          {menuItems.map((item) => (
            <View key={item.id} style={[styles.iconWrapper, { backgroundColor: item.color }]}>
              {item.icon}
              <Text style={styles.iconLabel}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  iconWrapper: {
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
}); 