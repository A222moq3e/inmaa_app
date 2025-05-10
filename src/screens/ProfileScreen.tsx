import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { ProfilePage } from '@/components/pages/ProfilePage';

/**
 * Profile screen component - displays user profile information
 */
function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfilePage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen; 