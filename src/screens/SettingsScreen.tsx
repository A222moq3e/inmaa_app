import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { SettingsPage } from '@/components/pages/SettingsPage';

/**
 * Settings screen component - displays app settings and preferences
 */
function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsPage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen; 