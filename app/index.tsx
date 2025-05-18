// Home Page / Root Page

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import ClubDetails from './ClubDetails';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ClubDetails />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
