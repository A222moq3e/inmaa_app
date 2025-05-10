/**
 * Defines the color palette for the application
 */

// Base palette
export const palette = {
  // Core colors
  primary: '#2E7D32',      // Green
  secondary: '#0288D1',    // Blue
  accent: '#D32F2F',       // Red
  
  // Greyscale
  black: '#000000',
  darkGrey: '#212121',
  grey: '#757575',
  lightGrey: '#BDBDBD',
  extraLightGrey: '#F5F5F5',
  white: '#FFFFFF',
  
  // Semantic
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // UI specific
  menuBlue: '#2196F3',
  menuRed: '#F44336',
  menuGreen: '#4CAF50',
  menuYellow: '#FFC107',
};

// Light theme
export const lightColors = {
  background: palette.white,
  card: palette.white,
  text: palette.black,
  textSecondary: palette.grey,
  border: palette.lightGrey,
  notification: palette.accent,
  tint: palette.primary,
  tabIconDefault: palette.grey,
  tabIconSelected: palette.primary,
  ...palette,
};

// Dark theme
export const darkColors = {
  background: palette.darkGrey,
  card: '#1E1E1E',
  text: palette.white,
  textSecondary: palette.lightGrey,
  border: palette.grey,
  notification: palette.accent,
  tint: palette.primary,
  tabIconDefault: palette.lightGrey,
  tabIconSelected: palette.primary,
  ...palette,
};

// Export the colors for different color schemes
export const colors = {
  light: lightColors,
  dark: darkColors,
};

export default colors; 