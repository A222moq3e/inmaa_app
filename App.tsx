import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import "./global.css";

import HomeScreen from "./screens/Home/HomeScreen";
import ProfileScreen from "./screens/Profile/Profile";
import { useColorScheme } from "~/lib/useColorScheme";

const Stack = createNativeStackNavigator();

export default function App() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <NavigationContainer theme={isDarkColorScheme ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
