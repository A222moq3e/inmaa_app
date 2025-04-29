import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/useThemeColor';

export type MenuItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
};

interface NavMenuProps {
  isVisible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function NavMenu({ isVisible, onClose, menuItems }: NavMenuProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <Animated.View 
      style={styles.overlay}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <TouchableOpacity style={styles.closeArea} onPress={onClose} activeOpacity={1}>
        <View style={styles.menuContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { backgroundColor }]}
                onPress={() => {
                  onClose();
                  item.action();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  {item.icon}
                </View>
                <Text style={[styles.menuText, { color: textColor }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" style={styles.arrow} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  closeArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 100,
  },
  menuContainer: {
    width: 280,
    maxHeight: height * 0.6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  arrow: {
    marginLeft: 10,
  },
}); 