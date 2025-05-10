import { useColorScheme } from '@/contexts/ThemeContext';
import Colors from '@/theme/colors';

/**
 * Returns the appropriate color for a theme prop, based on the current color scheme
 * 
 * @param props Component props that might include light or dark theme overrides
 * @param colorName The name of the color to retrieve
 * @returns The appropriate color value
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
} 