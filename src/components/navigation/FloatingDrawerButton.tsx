import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRouter, usePathname } from 'expo-router';

// Theme hooks
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * A floating action button that controls the drawer navigation
 */
function FloatingDrawerButton() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'text');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're in the drawer
  const isDrawerOpen = pathname.includes('(drawer)');
  
  // Animated rotation for the menu icon
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          rotate: withTiming(isDrawerOpen ? '90deg' : '0deg', {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }) 
        }
      ],
    };
  });

  const toggleDrawer = () => {
    try {
      // Add haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Use router to navigate to/from drawer
      if (isDrawerOpen) {
        router.back();
      } else {
        router.push('/(drawer)');
      }
    } catch (error) {
      console.log('Error toggling drawer:', error);
    }
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 20 }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={toggleDrawer}
        activeOpacity={0.8}
      >
        <Animated.View style={iconStyle}>
          <Ionicons 
            name={isDrawerOpen ? "close" : "menu"} 
            size={28} 
            color={iconColor} 
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default FloatingDrawerButton; 