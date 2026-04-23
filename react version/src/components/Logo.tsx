import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

export function Logo({ size = 100, color = '#006a4e', animated = true }: LogoProps) {
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      // Entry animation - scale and fade in
      scale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 500 });

      // Continuous rotation animation
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Outer Circle Background */}
        <Circle cx="50" cy="50" r="48" fill={color} opacity="0.15" />
        <Circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2.5" />

        {/* Inner Circle - Main */}
        <Circle cx="50" cy="50" r="40" fill={color} />

        {/* Bright Star/Crescent Moon and Star Islamic Symbol */}
        <G>
          {/* Crescent Moon - White */}
          <Path
            d="M 50 18 Q 62 28 62 40 Q 62 52 50 58 Q 38 52 38 40 Q 38 28 50 18"
            fill="#fff"
            opacity="0.95"
          />

          {/* Star Center - Gold */}
          <Path
            d="M 50 32 L 53 40 L 61 40 L 54 45 L 57 53 L 50 48 L 43 53 L 46 45 L 39 40 L 47 40 Z"
            fill="#b59410"
          />
        </G>

        {/* Geometric Islamic Pattern - Bottom Arc */}
        <G>
          {/* Main arc - bright */}
          <Path
            d="M 28 62 Q 50 72 72 62"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.9"
          />
          {/* Secondary arc - subtle */}
          <Path
            d="M 33 70 Q 50 77 67 70"
            fill="none"
            stroke="#fff"
            strokeWidth="1.2"
            opacity="0.5"
          />
        </G>

        {/* Decorative circles around center */}
        <Circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
        <Circle cx="50" cy="50" r="20" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
