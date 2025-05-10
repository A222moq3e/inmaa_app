import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';

// Import navigators and screens
import AppNavigator from './src/navigation/AppNavigator';
import ClubDetailsScreen from './src/screens/ClubDetailsScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';

const MainStack = createStackNavigator();

// Main App component
function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Main"
        >
          <MainStack.Screen name="Main" component={AppNavigator} />
          <MainStack.Screen name="ClubDetails" component={ClubDetailsScreen} />
          <MainStack.Screen name="EventDetails" component={EventDetailsScreen} />
          <MainStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Register the root component
registerRootComponent(App); 