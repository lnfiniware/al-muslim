import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocation } from '@hooks/useLocation';
import { qiblahService } from '@services/qiblahService';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeIn } from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function QiblahScreen() {
  const { location, loading } = useLocation();
  const [qiblahData, setQiblahData] = useState<any>(null);
  const rotationValue = useSharedValue(0);

  useEffect(() => {
    if (location?.coordinates) {
      const qiblah = qiblahService.calculateQiblah(
        location.coordinates.latitude,
        location.coordinates.longitude
      );
      setQiblahData(qiblah);
      rotationValue.value = withSpring(qiblah.angle, { damping: 6 });
    }
  }, [location]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  if (loading || !qiblahData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Calculating Qiblah Direction...</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>🕌 Qiblah Direction</Text>
          <Text style={styles.headerSubtitle}>Face towards the Kaaba</Text>
        </LinearGradient>

        {/* Main Compass */}
        <View style={styles.compassSection}>
          <View style={styles.compassContainer}>
            {/* Direction labels */}
            <View style={[styles.directionLabel, styles.northLabel]}>
              <Text style={styles.directionText}>N</Text>
            </View>
            <View style={[styles.directionLabel, styles.eastLabel]}>
              <Text style={styles.directionText}>E</Text>
            </View>
            <View style={[styles.directionLabel, styles.southLabel]}>
              <Text style={styles.directionText}>S</Text>
            </View>
            <View style={[styles.directionLabel, styles.westLabel]}>
              <Text style={styles.directionText}>W</Text>
            </View>

            {/* Compass circle */}
            <View style={styles.circle2} />
            <View style={styles.circle1} />

            {/* Needle */}
            <Animated.View style={[styles.needle, needleStyle]}>
              <LinearGradient
                colors={['#ff4444', '#cc0000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.needleGradient}
              >
                <View style={styles.needleTop} />
              </LinearGradient>
            </Animated.View>

            {/* Center Kaaba icon */}
            <View style={styles.center}>
              <LinearGradient
                colors={[colors.secondary, '#d4a82e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.kaabaCircle}
              >
                <Text style={styles.kaabaIcon}>🕌</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Information Cards */}
        <View style={styles.infoSection}>
          {/* Direction Card */}
          <LinearGradient
            colors={['rgba(0, 106, 78, 0.08)', 'rgba(0, 106, 78, 0.04)']}
            style={styles.infoCard}
          >
            <Text style={styles.infoCardLabel}>Direction</Text>
            <Text style={styles.infoCardValue}>{qiblahData.direction}</Text>
            <Text style={styles.infoCardEmoji}>{qiblahService.getDirectionEmoji(qiblahData.direction)}</Text>
          </LinearGradient>

          {/* Angle Card */}
          <LinearGradient
            colors={['rgba(181, 148, 16, 0.08)', 'rgba(181, 148, 16, 0.04)']}
            style={styles.infoCard}
          >
            <Text style={styles.infoCardLabel}>Angle</Text>
            <Text style={styles.infoCardValue}>{qiblahService.formatAngle(qiblahData.angle)}</Text>
            <Text style={styles.infoCardSubtext}>degrees from North</Text>
          </LinearGradient>
        </View>

        {/* Instructions */}
        <View style={styles.instructionSection}>
          <LinearGradient
            colors={['rgba(25, 118, 210, 0.1)', 'rgba(25, 118, 210, 0.05)']}
            style={styles.instructionCard}
          >
            <Text style={styles.instructionTitle}>📍 How to Use</Text>
            <Text style={styles.instructionText}>
              1. Allow location access for accurate direction{'\n'}
              2. Hold your device level (flat or slightly tilted){'\n'}
              3. Rotate until the red needle points upward{'\n'}
              4. You are now facing the Kaaba
            </Text>
          </LinearGradient>
        </View>

        {/* Tip Section */}
        <View style={styles.tipSection}>
          <LinearGradient
            colors={['#fff9c4', '#fffde7']}
            style={styles.tipCard}
          >
            <Text style={styles.tipTitle}>💡 Calibration Tip</Text>
            <Text style={styles.tipText}>
              If the needle doesn't respond smoothly, calibrate your device's compass by moving it in a figure-8 pattern.
            </Text>
          </LinearGradient>
        </View>

        {/* Location Info */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Latitude</Text>
              <Text style={styles.locationValue}>{location?.coordinates.latitude.toFixed(4)}° N</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Longitude</Text>
              <Text style={styles.locationValue}>{location?.coordinates.longitude.toFixed(4)}° E</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray,
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  compassSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  compassContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  circle2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(0, 106, 78, 0.1)',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 106, 78, 0.05)',
  },
  directionLabel: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 106, 78, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  northLabel: {
    top: 12,
  },
  eastLabel: {
    right: 12,
  },
  southLabel: {
    bottom: 12,
  },
  westLabel: {
    left: 12,
  },
  directionText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  needle: {
    width: 8,
    height: 120,
    position: 'absolute',
    justifyContent: 'flex-start',
  },
  needleGradient: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 4,
  },
  needleTop: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#cc0000',
  },
  kaabaCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  kaabaIcon: {
    fontSize: 40,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 106, 78, 0.1)',
  },
  infoCardLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  infoCardEmoji: {
    fontSize: 24,
  },
  infoCardSubtext: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
  },
  instructionSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  instructionCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 20,
  },
  tipSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f57f17',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#e65100',
    lineHeight: 19,
  },
  locationSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  locationItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 106, 78, 0.1)',
  },
  locationLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace',
  },
});
