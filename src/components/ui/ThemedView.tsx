import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  light?: string;
  dark?: string;
};

/**
 * A View component that supports theming with light/dark mode
 */
export function ThemedView(props: ThemedViewProps) {
  const { style, light, dark, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light, dark }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export default ThemedView; 