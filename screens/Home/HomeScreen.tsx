
// screens/Home/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './Home.styles';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>
    </ScrollView>
  );
}