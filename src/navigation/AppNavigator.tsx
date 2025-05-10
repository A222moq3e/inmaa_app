import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Navigation components 
import FloatingDrawerButton from '@/components/navigation/FloatingDrawerButton';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import ClubsScreen from '@/screens/ClubsScreen';
import EventsScreen from '@/screens/EventsScreen';
import TasksScreen from '@/screens/TasksScreen';
import MembershipsScreen from '@/screens/MembershipsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AboutScreen from '@/screens/AboutScreen';

const Drawer = createDrawerNavigator();

// Custom drawer content component
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  return (
    <DrawerContentScrollView 
      {...props}
      style={{ backgroundColor }}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.drawerTitle}>
          <Ionicons name="business" size={24} color={textColor} style={styles.drawerIcon} />
          <View>
            <Text style={[styles.drawerTitleText, { color: textColor }]}>Student Club</Text>
            <Text style={[styles.drawerSubtitle, { color: textColor }]}>Management System</Text>
          </View>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

/**
 * Main application navigator with drawer navigation
 */
function AppNavigator() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: textColor,
          drawerInactiveTintColor: 'gray',
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 16,
          },
          drawerStyle: {
            backgroundColor,
            width: '75%',
          },
          swipeEnabled: false, // Disable swipe to open - we'll use our button instead
        }}
      >
        <Drawer.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home",
            drawerIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        
        {/* Clubs Section */}
        <Drawer.Screen 
          name="Clubs"
          component={ClubsScreen}
          options={{
            title: "Clubs",
            drawerIcon: ({ color }) => (
              <Ionicons name="people" size={24} color={color} />
            ),
          }}
        />
        
        {/* Events Section */}
        <Drawer.Screen 
          name="Events"
          component={EventsScreen}
          options={{
            title: "Events",
            drawerIcon: ({ color }) => (
              <Ionicons name="calendar" size={24} color={color} />
            ),
          }}
        />
        
        {/* Tasks Section */}
        <Drawer.Screen 
          name="Tasks"
          component={TasksScreen}
          options={{
            title: "Tasks",
            drawerIcon: ({ color }) => (
              <Ionicons name="list-circle" size={24} color={color} />
            ),
          }}
        />
        
        {/* Memberships Section */}
        <Drawer.Screen 
          name="Memberships"
          component={MembershipsScreen}
          options={{
            title: "My Memberships",
            drawerIcon: ({ color }) => (
              <Ionicons name="card" size={24} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen 
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
            drawerIcon: ({ color }) => (
              <Ionicons name="person" size={24} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen 
          name="Settings"
          component={SettingsScreen}
          options={{
            title: "Settings",
            drawerIcon: ({ color }) => (
              <Ionicons name="settings" size={24} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen 
          name="About"
          component={AboutScreen}
          options={{
            title: "About",
            drawerIcon: ({ color }) => (
              <Ionicons name="information-circle" size={24} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
      
      {/* Floating button to open/close drawer */}
      <FloatingDrawerButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  drawerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerIcon: {
    marginRight: 12,
  },
  drawerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
});

export default AppNavigator; 