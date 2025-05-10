import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  light?: string;
  dark?: string;
  style?: StyleProp<TextStyle>;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
};

/**
 * A Text component that supports theming with light/dark mode
 */
export function ThemedText(props: ThemedTextProps) {
  const { style, light, dark, variant = 'body', ...otherProps } = props;
  const color = useThemeColor({ light, dark }, 'text');
  
  // Apply variant styles based on the design system
  let variantStyle;
  switch (variant) {
    case 'h1':
      variantStyle = styles.h1;
      break;
    case 'h2':
      variantStyle = styles.h2;
      break;
    case 'h3':
      variantStyle = styles.h3;
      break;
    case 'h4':
      variantStyle = styles.h4;
      break;
    case 'caption':
      variantStyle = styles.caption;
      break;
    default:
      variantStyle = styles.body;
  }

  return <Text style={[{ color }, variantStyle, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 3,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 2,
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default ThemedText; 