import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface NavButtonProps {
  onPress: () => void;
  isMenuOpen: boolean;
}

export function NavButton({ onPress, isMenuOpen }: NavButtonProps) {
  const backgroundColor = useThemeColor({}, 'primary');
  const iconColor = useThemeColor({}, 'white');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: withTiming(isMenuOpen ? '90deg' : '0deg', { 
          duration: 300, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
        }) }
      ]
    };
  });

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons 
          name={isMenuOpen ? "close" : "menu"} 
          size={24} 
          color={iconColor} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 