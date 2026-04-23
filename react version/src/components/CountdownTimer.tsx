import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  prayerName?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  hours,
  minutes,
  seconds,
  prayerName,
}) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Entry animation
    scale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 90 });
    opacity.value = withTiming(1, { duration: 600 });

    // Continuous subtle pulse effect
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { scale: pulse.value },
    ],
    opacity: opacity.value,
  }));

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <Animated.View style={[styles.container, { opacity: opacity }]}>
      {prayerName && <Text style={styles.prayerName}>{prayerName}</Text>}
      <Animated.View style={[styles.timerContainer, animatedContainerStyle]}>
        <View style={styles.gradientOverlay} />
        <Text style={styles.timerText}>
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#006a4e',
    letterSpacing: 0.5,
  },
  timerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 36,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#006a4e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#b59410',
    opacity: 0.3,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#006a4e',
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
});
