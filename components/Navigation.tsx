import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { NavButton } from './NavButton';
import { NavMenu } from './NavMenu';
import { NavDrawer } from './NavDrawer';
import { useNav } from '@/context/NavContext';
import { useColorScheme } from '@/hooks/useColorScheme';

interface NavigationProps {
  children: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const { 
    isMenuOpen, 
    openMenu, 
    closeMenu, 
    drawer, 
    closeDrawer,
    menuItems 
  } = useNav();
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      {children}

      {/* Background blur when menu is open */}
      {isMenuOpen && (
        <Animated.View 
          style={StyleSheet.absoluteFill}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <BlurView 
            intensity={30} 
            style={StyleSheet.absoluteFill} 
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        </Animated.View>
      )}

      {/* The navigation button in the bottom left */}
      <View style={styles.navButtonContainer}>
        <NavButton onPress={openMenu} isMenuOpen={isMenuOpen} />
      </View>

      {/* The menu overlay */}
      <NavMenu 
        isVisible={isMenuOpen} 
        onClose={closeMenu} 
        menuItems={menuItems} 
      />

      {/* The drawer */}
      <NavDrawer 
        isVisible={drawer.isOpen} 
        onClose={closeDrawer}
        title={drawer.title}
      >
        {drawer.content}
      </NavDrawer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navButtonContainer: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    zIndex: 100,
  },
}); 