import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { storageService } from '@core/storage';
import { Logo } from '@components/Logo';
import { PressableButton } from '@components/PressableButton';

type OnboardingStep = 'welcome' | 'location' | 'notifications' | 'complete';

export default function OnboardingScreen() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        await storageService.setSetting('locationEnabled', true);
        setStep('notifications');
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is needed for accurate prayer times.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request location permission');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await storageService.setSetting('notificationsEnabled', true);
        setStep('complete');
      } else {
        // Allow skipping notifications
        await storageService.setSetting('notificationsEnabled', false);
        setStep('complete');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request notification permission');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    await storageService.setSetting('onboardingComplete', true);
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await storageService.setSetting('onboardingComplete', true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 'welcome' && (
          <View style={styles.stepContainer}>
            <Logo size={120} color="#006a4e" animated={true} />

            <Text style={styles.title}>Welcome to Al-Muslim</Text>
            <Text style={styles.subtitle}>
              Your companion for Islamic devotion
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>⏰</Text>
                <Text style={styles.featureText}>Accurate Prayer Times</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📖</Text>
                <Text style={styles.featureText}>Quranic Content</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🤲</Text>
                <Text style={styles.featureText}>Daily Remembrances</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🔔</Text>
                <Text style={styles.featureText}>Smart Notifications</Text>
              </View>
            </View>
          </View>
        )}

        {step === 'location' && (
          <View style={styles.stepContainer}>
            <View style={styles.permissionIcon}>
              <Text style={styles.permissionEmoji}>📍</Text>
            </View>

            <Text style={styles.title}>Enable Location Access</Text>
            <Text style={styles.subtitle}>
              We need your location to calculate accurate prayer times for your
              area.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✓ Your location is only used locally on your device
              </Text>
              <Text style={styles.infoText}>
                ✓ We never store or share your location data
              </Text>
            </View>
          </View>
        )}

        {step === 'notifications' && (
          <View style={styles.stepContainer}>
            <View style={styles.permissionIcon}>
              <Text style={styles.permissionEmoji}>🔔</Text>
            </View>

            <Text style={styles.title}>Enable Notifications</Text>
            <Text style={styles.subtitle}>
              Get reminders for prayer times and special Islamic dates.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✓ Customizable prayer time reminders
              </Text>
              <Text style={styles.infoText}>✓ Islamic holidays and events</Text>
              <Text style={styles.infoText}>
                ✓ You can turn off notifications anytime
              </Text>
            </View>
          </View>
        )}

        {step === 'complete' && (
          <View style={styles.stepContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>✨</Text>
            </View>

            <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>
              You're ready to start your Islamic journey with Al-Muslim.
            </Text>

            <View style={styles.readyBox}>
              <Text style={styles.readyText}>
                May Allah bless your worship and increase your knowledge of the
                Quran. 🤲
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {step === 'welcome' && (
          <>
            <PressableButton
              label="Get Started"
              onPress={() => setStep('location')}
              variant="primary"
              size="large"
              icon="🚀"
              haptic={true}
            />
            <Pressable onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </Pressable>
          </>
        )}

        {step === 'location' && (
          <>
            <PressableButton
              label={loading ? '' : 'Enable Location'}
              onPress={handleLocationPermission}
              disabled={loading}
              variant="primary"
              size="large"
              icon="📍"
              haptic={true}
            />
            {loading && <ActivityIndicator color="#006a4e" size="large" style={styles.loader} />}
            <Pressable onPress={() => setStep('notifications')}>
              <Text style={styles.skipText}>Skip this step</Text>
            </Pressable>
          </>
        )}

        {step === 'notifications' && (
          <>
            <PressableButton
              label={loading ? '' : 'Enable Notifications'}
              onPress={handleNotificationPermission}
              disabled={loading}
              variant="primary"
              size="large"
              icon="🔔"
              haptic={true}
            />
            {loading && <ActivityIndicator color="#006a4e" size="large" style={styles.loader} />}
            <Pressable onPress={() => setStep('complete')}>
              <Text style={styles.skipText}>Skip this step</Text>
            </Pressable>
          </>
        )}

        {step === 'complete' && (
          <PressableButton
            label="Start Now"
            onPress={handleCompleteOnboarding}
            variant="primary"
            size="large"
            icon="✨"
            haptic={true}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  stepContainer: {
    alignItems: 'center',
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f7f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#b59410',
  },
  permissionEmoji: {
    fontSize: 50,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f7f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#4caf50',
  },
  successEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#121212',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featuresList: {
    width: '100%',
    marginTop: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#f0f7f6',
    borderLeftWidth: 4,
    borderLeftColor: '#006a4e',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  readyBox: {
    backgroundColor: '#f0f7f6',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  readyText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  loader: {
    marginVertical: 8,
  },
  skipText: {
    textAlign: 'center',
    color: '#006a4e',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },
});
