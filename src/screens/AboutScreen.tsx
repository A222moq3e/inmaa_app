import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { AboutPage } from '@/components/pages/AboutPage';

/**
 * About screen component - displays information about the app
 */
function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AboutPage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AboutScreen; 