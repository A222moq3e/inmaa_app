import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Theme & Constants
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

/**
 * Home screen component - main landing page of the app
 */
function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme();

  const menuItems = [
    {
      id: 'profile',
      title: 'My Profile',
      icon: <Ionicons name="person" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuBlue,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Ionicons name="notifications" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuRed,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Ionicons name="settings" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuGreen,
    },
    {
      id: 'about',
      title: 'About',
      icon: <Ionicons name="information-circle" size={22} color="#fff" />,
      color: Colors[colorScheme ?? 'light'].menuYellow,
    },
  ];

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

export default HomeScreen; 