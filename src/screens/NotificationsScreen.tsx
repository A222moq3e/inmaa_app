import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { NotificationsPage } from '@/components/pages/NotificationsPage';

/**
 * Notifications screen component - displays user notifications
 */
function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationsPage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NotificationsScreen; 