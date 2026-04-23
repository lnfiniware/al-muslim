import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { i18n } from '@core/i18n';
import { storageService } from '@core/storage';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'features' | 'location' | 'notifications' | 'complete';

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const isArabic = i18n.isArabic();

  const handleNext = () => {
    const steps: OnboardingStep[] = ['welcome', 'features', 'location', 'notifications', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleSkip = () => {
    markOnboardingComplete();
    onComplete();
  };

  const handleComplete = async () => {
    await markOnboardingComplete();
    onComplete();
  };

  const markOnboardingComplete = async () => {
    await storageService.setSetting('onboardingComplete', true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {currentStep === 'welcome' && <WelcomeStep onNext={handleNext} onSkip={handleSkip} />}
      {currentStep === 'features' && <FeaturesStep onNext={handleNext} />}
      {currentStep === 'location' && <LocationStep onNext={handleNext} />}
      {currentStep === 'notifications' && <NotificationsStep onNext={handleNext} />}
      {currentStep === 'complete' && <CompleteStep onComplete={handleComplete} />}
    </View>
  );
}

function WelcomeStep({ onNext, onSkip }: any) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.stepContainer}
    >
      <Animated.View entering={FadeInDown} style={styles.content}>
        <Text style={styles.logo}>🕌</Text>
        <Text style={styles.title}>{i18n.t('onboarding.welcome')}</Text>
        <Text style={styles.subtitle}>{i18n.t('onboarding.subtitle')}</Text>

        <View style={styles.spacing} />

        <View style={styles.featureList}>
          <FeatureItem icon="🤲" text={i18n.t('onboarding.features.prayer')} />
          <FeatureItem icon="📖" text={i18n.t('onboarding.features.quran')} />
          <FeatureItem icon="📿" text={i18n.t('onboarding.features.adhkar')} />
          <FeatureItem icon="🔔" text={i18n.t('onboarding.features.notifications')} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onNext}
            style={styles.primaryButton}
            labelStyle={{ fontSize: 14, fontWeight: '600' }}
          >
            {i18n.t('common.next')}
          </Button>
          <Button
            mode="text"
            onPress={onSkip}
            labelStyle={{ color: '#fff', fontSize: 13 }}
          >
            {i18n.t('onboarding.skip')}
          </Button>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

function FeaturesStep({ onNext }: any) {
  return (
    <ScrollView style={styles.stepContainer} contentContainerStyle={styles.stepContent}>
      <Animated.View entering={FadeInUp} style={styles.content}>
        <Text style={styles.stepTitle}>✨ App Features</Text>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>⏰</Text>
          <Text style={styles.featureTitle}>Accurate Prayer Times</Text>
          <Text style={styles.featureDescription}>
            Get precise prayer times for your location using advanced Islamic calculation methods
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📖</Text>
          <Text style={styles.featureTitle}>Holy Quran</Text>
          <Text style={styles.featureDescription}>
            Read the Quran in beautiful Mushaf style with Arabic and translations
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📿</Text>
          <Text style={styles.featureTitle}>Daily Adhkar</Text>
          <Text style={styles.featureDescription}>
            Remembrances for morning, evening, and before sleep with progress tracking
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📅</Text>
          <Text style={styles.featureTitle}>Islamic Calendar</Text>
          <Text style={styles.featureDescription}>
            Track the Hijri calendar and Islamic dates throughout the year
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={onNext}
          style={styles.primaryButton}
          labelStyle={{ fontSize: 14, fontWeight: '600' }}
        >
          {i18n.t('common.next')}
        </Button>
      </Animated.View>
    </ScrollView>
  );
}

function LocationStep({ onNext }: any) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.stepContainer}
    >
      <Animated.View entering={FadeInDown} style={styles.content}>
        <Text style={styles.logo}>📍</Text>
        <Text style={styles.title}>{i18n.t('onboarding.location.title')}</Text>
        <Text style={styles.description}>{i18n.t('onboarding.location.description')}</Text>

        <View style={styles.privacyBox}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View style={styles.privacyTextContainer}>
            <Text style={styles.privacyText}>{i18n.t('onboarding.location.privacy')}</Text>
            <Text style={styles.privacyText}>{i18n.t('onboarding.location.never')}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onNext}
            style={styles.primaryButton}
            labelStyle={{ fontSize: 14, fontWeight: '600' }}
          >
            {i18n.t('onboarding.enableLocation')}
          </Button>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

function NotificationsStep({ onNext }: any) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.stepContainer}
    >
      <Animated.View entering={FadeInDown} style={styles.content}>
        <Text style={styles.logo}>🔔</Text>
        <Text style={styles.title}>{i18n.t('onboarding.notifications.title')}</Text>
        <Text style={styles.description}>{i18n.t('onboarding.notifications.description')}</Text>

        <View style={styles.notificationsList}>
          <NotificationItem text={i18n.t('onboarding.notifications.reminders')} />
          <NotificationItem text={i18n.t('onboarding.notifications.holidays')} />
          <NotificationItem text={i18n.t('onboarding.notifications.control')} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onNext}
            style={styles.primaryButton}
            labelStyle={{ fontSize: 14, fontWeight: '600' }}
          >
            {i18n.t('onboarding.enableNotifications')}
          </Button>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

function CompleteStep({ onComplete }: any) {
  return (
    <LinearGradient
      colors={[colors.secondary, '#8B6F47']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.stepContainer}
    >
      <Animated.View entering={FadeInUp} style={[styles.content, styles.completeContent]}>
        <Text style={styles.logo}>✨</Text>
        <Text style={styles.title}>{i18n.t('onboarding.complete')}</Text>
        <Text style={styles.description}>{i18n.t('onboarding.ready')}</Text>

        <View style={styles.blessingBox}>
          <Text style={styles.blessingText}>{i18n.t('onboarding.blessing')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onComplete}
            style={styles.primaryButton}
            labelStyle={{ fontSize: 14, fontWeight: '600' }}
          >
            {i18n.t('onboarding.started')}
          </Button>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

function FeatureItem({ icon, text }: any) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={styles.itemText}>{text}</Text>
    </View>
  );
}

function NotificationItem({ text }: any) {
  return (
    <View style={styles.notificationItem}>
      <Text style={styles.checkmark}>✓</Text>
      <Text style={styles.notificationText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stepContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },
  completeContent: {
    justifyContent: 'center',
  },
  logo: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  spacing: {
    height: 24,
  },
  featureList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  itemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  privacyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 4,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationsList: {
    width: '100%',
    marginBottom: 32,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  blessingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  blessingText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
  },
});
