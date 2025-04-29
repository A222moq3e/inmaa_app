import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

interface NavDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function NavDrawer({ isVisible, onClose, title, children }: NavDrawerProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'primary');
  
  // Use useState to track render state instead of a shared value
  const [shouldRender, setShouldRender] = useState(false);
  // For left side drawer, we start at negative width
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // First make sure it's rendered
      setShouldRender(true);
      
      // Then start animations in the next frame
      requestAnimationFrame(() => {
        translateX.value = withTiming(0, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        opacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      // Start hiding animations
      translateX.value = withTiming(-DRAWER_WIDTH, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      opacity.value = withTiming(0, { 
        duration: 300,
        callback: (finished) => {
          if (finished) {
            runOnJS(setShouldRender)(false);
          }
        }
      });
    }
  }, [isVisible]);

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      pointerEvents: opacity.value > 0 ? 'auto' : 'none',
    };
  });

  // Don't render anything if we shouldn't
  if (!shouldRender) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.overlay, overlayAnimatedStyle]} 
        onTouchEnd={() => onClose()}
      />
      
      <Animated.View style={[
        styles.drawer, 
        { backgroundColor }, 
        drawerAnimatedStyle
      ]}>
        <View style={[styles.header, { backgroundColor: headerColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
}); 