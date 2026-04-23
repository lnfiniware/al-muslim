import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrayerTime } from '@services/prayerTimesService';

interface PrayerCardProps {
  prayer: PrayerTime;
  isUpcoming?: boolean;
  isCurrentPrayer?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PrayerCard: React.FC<PrayerCardProps> = ({
  prayer,
  isUpcoming = false,
  isCurrentPrayer = false,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = async () => {
    scale.value = withSpring(0.96, { damping: 10, mass: 1, stiffness: 100 });
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics not available
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 90 });
  };

  const handlePress = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Haptics not available
    }
    onPress?.();
  };

  const getBackgroundColor = () => {
    if (isCurrentPrayer) return '#e8f5e9';
    if (isUpcoming) return '#fff3e0';
    return '#f5f5f5';
  };

  const getBorderColor = () => {
    if (isCurrentPrayer) return '#4caf50';
    if (isUpcoming) return '#ff9800';
    return '#e0e0e0';
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.cardPressable,
        animatedStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: getBackgroundColor(),
            borderLeftColor: getBorderColor(),
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.prayerName}>{prayer.name}</Text>
          <Text style={styles.prayerTime}>{prayer.timeString}</Text>
        </View>
        {isCurrentPrayer && <Text style={styles.badgeCurrent}>Now</Text>}
        {isUpcoming && <Text style={styles.badgeUpcoming}>Next</Text>}
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  cardPressable: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
    minWidth: 60,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006a4e',
  },
  badgeCurrent: {
    backgroundColor: '#4caf50',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 12,
  },
  badgeUpcoming: {
    backgroundColor: '#ff9800',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 12,
  },
});
