import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';

// Import screens
import ClubDetailsScreen from '@/screens/ClubDetailsScreen';
import EventDetailsScreen from '@/screens/EventDetailsScreen';
import TaskDetailsScreen from '@/screens/TaskDetailsScreen';

// Create the stack navigator
const Stack = createStackNavigator();

// Stack navigator for detail screens
function StackNavigator() {
  const route = useRoute();
  
  // Get the route name and params
  const routeName = route.name;
  const routeParams = route.params || {};
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header for all screens
      }}
      initialRouteName={routeName}
    >
      <Stack.Screen 
        name="ClubDetails" 
        component={ClubDetailsScreen}
        initialParams={routeName === 'ClubDetails' ? routeParams : undefined}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        initialParams={routeName === 'EventDetails' ? routeParams : undefined}
      />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskDetailsScreen}
        initialParams={routeName === 'TaskDetails' ? routeParams : undefined}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator; 