import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface PressableButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  haptic?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableButton({
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  style,
  haptic = true,
}: PressableButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = async () => {
    if (disabled) return;

    scale.value = withSpring(0.92, { damping: 10, mass: 1, stiffness: 100 });
    
    if (haptic) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        // Haptics not available on some devices
      }
    }
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 90 });
  };

  const handlePress = async (event: GestureResponderEvent) => {
    if (haptic) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        // Haptics not available
      }
    }
    onPress(event);
  };

  const getButtonStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button];

    // Size variants
    if (size === 'small') {
      baseStyle.push(styles.buttonSmall as ViewStyle);
    } else if (size === 'large') {
      baseStyle.push(styles.buttonLarge as ViewStyle);
    } else {
      baseStyle.push(styles.buttonMedium as ViewStyle);
    }

    // Color variants
    if (variant === 'primary') {
      baseStyle.push(styles.buttonPrimary as ViewStyle);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.buttonSecondary as ViewStyle);
    } else if (variant === 'tertiary') {
      baseStyle.push(styles.buttonTertiary as ViewStyle);
    }

    // Disabled state
    if (disabled) {
      baseStyle.push(styles.buttonDisabled as ViewStyle);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle[] = [styles.buttonText];

    if (size === 'small') {
      baseStyle.push(styles.textSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.textLarge);
    } else {
      baseStyle.push(styles.textMedium);
    }

    if (variant === 'secondary' || variant === 'tertiary') {
      baseStyle.push(styles.textSecondary);
    }

    if (disabled) {
      baseStyle.push(styles.textDisabled);
    }

    return baseStyle;
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[getButtonStyle(), animatedStyle, style]}
    >
      {icon && <Text style={styles.icon}>{icon} </Text>}
      <Text style={getTextStyle()}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSmall: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonMedium: {
    paddingVertical: 12,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  buttonPrimary: {
    backgroundColor: '#006a4e',
  },
  buttonSecondary: {
    backgroundColor: '#b59410',
  },
  buttonTertiary: {
    backgroundColor: '#f0f0f0',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textSmall: {
    fontSize: 13,
    color: '#fff',
  },
  textMedium: {
    fontSize: 16,
    color: '#fff',
  },
  textLarge: {
    fontSize: 18,
    color: '#fff',
  },
  textSecondary: {
    color: '#006a4e',
  },
  textDisabled: {
    color: '#999',
  },
  icon: {
    fontSize: 18,
    marginRight: 4,
    color: 'inherit',
  },
});
