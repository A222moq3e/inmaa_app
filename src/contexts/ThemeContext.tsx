import React, { createContext, useContext, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for theme context
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceColorScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  
  // Derived color scheme based on theme setting
  const colorScheme = theme === 'system' 
    ? (deviceColorScheme || 'light') as 'light' | 'dark'
    : theme;
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };
  
  const value = {
    theme,
    colorScheme,
    setTheme,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get current color scheme
 */
export function useColorScheme(): 'light' | 'dark' {
  const { colorScheme } = useTheme();
  return colorScheme;
} 