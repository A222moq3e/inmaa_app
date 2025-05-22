import * as React from 'react';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  // Redirect to the tabbed navigation
  return <Redirect href="/(tabs)" />;
}
