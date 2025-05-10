import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  StyleProp
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconsGlyphs } from '@expo/vector-icons/build/Ionicons';

// Theme
import ThemedText from './ThemedText';
import Colors from '@/theme/colors';
import { useColorScheme } from '@/contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof IoniconsGlyphs;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A customizable button component with various styles and states
 */
function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  // Determine background color based on variant and state
  let backgroundColor;
  let textColor;
  let borderColor;
  
  if (disabled) {
    backgroundColor = variant === 'ghost' || variant === 'outline' 
      ? 'transparent' 
      : colors.lightGrey;
    textColor = colors.grey;
    borderColor = variant === 'outline' ? colors.lightGrey : 'transparent';
  } else {
    switch (variant) {
      case 'primary':
        backgroundColor = colors.primary;
        textColor = colors.white;
        borderColor = 'transparent';
        break;
      case 'secondary':
        backgroundColor = colors.secondary;
        textColor = colors.white;
        borderColor = 'transparent';
        break;
      case 'outline':
        backgroundColor = 'transparent';
        textColor = colors.primary;
        borderColor = colors.primary;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        textColor = colors.primary;
        borderColor = 'transparent';
        break;
    }
  }
  
  // Determine padding based on size
  let buttonStyles;
  let textSize;
  
  switch (size) {
    case 'small':
      buttonStyles = styles.buttonSmall;
      textSize = styles.textSmall;
      break;
    case 'large':
      buttonStyles = styles.buttonLarge;
      textSize = styles.textLarge;
      break;
    default:
      buttonStyles = styles.buttonMedium;
      textSize = styles.textMedium;
  }
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        buttonStyles,
        { backgroundColor, borderColor },
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={textColor}
              style={styles.iconLeft}
            />
          )}
          <ThemedText
            style={[{ color: textColor }, textSize, textStyle]}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={textColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  textMedium: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button; 