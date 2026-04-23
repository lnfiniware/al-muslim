import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { qiblahService, type QiblahDirection } from '@services/qiblahService';
import { useLocation } from '@hooks/useLocation';
import { colors } from '@theme/colors';

interface QiblahCompassProps {
  onPress?: () => void;
}

export function QiblahCompass({ onPress }: QiblahCompassProps) {
  const { location, loading } = useLocation();
  const [qiblah, setQiblah] = useState<QiblahDirection | null>(null);
  const rotationValue = useSharedValue(0);

  useEffect(() => {
    if (location?.coordinates) {
      const qiblahDir = qiblahService.calculateQiblah(
        location.coordinates.latitude,
        location.coordinates.longitude
      );
      setQiblah(qiblahDir);
      rotationValue.value = withSpring(qiblahDir.angle, { damping: 8 });
    }
  }, [location]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  if (loading || !qiblah) {
    return (
      <Animated.View entering={FadeIn} style={styles.cardWrapper}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.loadingText}>Loading Qiblah Direction...</Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.cardWrapper}>
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>🕌 Qiblah Direction</Text>

          <View style={styles.compassOuter}>
            <View style={styles.compass}>
              <View style={[styles.directionLabel, styles.north]}>
                <Text style={styles.directionText}>N</Text>
              </View>
              <View style={[styles.directionLabel, styles.east]}>
                <Text style={styles.directionText}>E</Text>
              </View>
              <View style={[styles.directionLabel, styles.south]}>
                <Text style={styles.directionText}>S</Text>
              </View>
              <View style={[styles.directionLabel, styles.west]}>
                <Text style={styles.directionText}>W</Text>
              </View>

              <Animated.View style={[styles.needle, needleStyle]}>
                <View style={styles.needleHead} />
              </Animated.View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Direction</Text>
              <Text style={styles.infoValue}>{qiblah.direction}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Angle</Text>
              <Text style={styles.infoValue}>{qiblahService.formatAngle(qiblah.angle)}</Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>
            Point towards Kaaba
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  compassOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
  },
  compass: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  directionLabel: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  north: {
    top: 8,
  },
  east: {
    right: 8,
  },
  south: {
    bottom: 8,
  },
  west: {
    left: 8,
  },
  directionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  needle: {
    width: 6,
    height: 100,
    backgroundColor: '#ff4444',
    borderRadius: 3,
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  needleHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  infoItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
