import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Theme hooks
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Custom drawer content component with theme support
 */
function DrawerContent(props: Record<string, unknown>) {
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
            <Text style={[styles.drawerTitleText, { color: textColor }]}>Alinma App</Text>
            <Text style={[styles.drawerSubtitle, { color: textColor }]}>Banking & Finance</Text>
          </View>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
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

export default DrawerContent; 