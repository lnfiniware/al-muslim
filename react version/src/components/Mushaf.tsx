import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  I18nManager,
} from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@theme/colors';
import { i18n } from '@core/i18n';

interface MushafAyah {
  number: number;
  text: string;
  translation?: string;
}

interface MushafProps {
  surahName: string;
  surahNumber: number;
  ayahs: MushafAyah[];
  showTranslation?: boolean;
}

export function Mushaf({ surahName, surahNumber, ayahs, showTranslation = false }: MushafProps) {
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const isArabic = i18n.isArabic();

  const handleAyahPress = (number: number) => {
    setSelectedAyah(selectedAyah === number ? null : number);
  };

  return (
    <View style={styles.container}>
      {/* Mushaf Header */}
      <View style={styles.header}>
        <Text style={styles.bismillah}>بسم الله الرحمن الرحيم</Text>
        <Text style={styles.surahName}>{surahName}</Text>
        <Text style={styles.surahInfo}>
          Surah {surahNumber} • {ayahs.length} Ayahs
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.ornament}>❖</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Quran Text */}
      <ScrollView
        style={styles.textContainer}
        contentContainerStyle={styles.textContent}
      >
        {ayahs.map((ayah) => (
          <Pressable
            key={ayah.number}
            onPress={() => handleAyahPress(ayah.number)}
            style={[
              styles.ayahContainer,
              selectedAyah === ayah.number && styles.ayahSelected,
            ]}
          >
            {/* Ayah Text (Arabic) */}
            <View
              style={[
                styles.ayahTextWrapper,
                isArabic && styles.ayahTextWrapperRTL,
              ]}
            >
              <Text
                style={[
                  styles.ayahText,
                  isArabic && styles.ayahTextArabic,
                ]}
              >
                {ayah.text}
              </Text>
              <View
                style={[
                  styles.ayahNumber,
                  isArabic && styles.ayahNumberRTL,
                ]}
              >
                <Text style={styles.ayahNumberText}>{ayah.number}</Text>
              </View>
            </View>

            {/* Ayah Translation */}
            {showTranslation && ayah.translation && (
              <Text style={styles.translationText}>{ayah.translation}</Text>
            )}

            {/* Selected Ayah Details */}
            {selectedAyah === ayah.number && (
              <View style={styles.ayahDetails}>
                <Text style={styles.detailsText}>
                  Ayah {ayah.number} of {ayahs.length}
                </Text>
                <Text style={styles.shareText}>Tap to share this ayah</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.ornament}>❖</Text>
          <View style={styles.dividerLine} />
        </View>
        <Text style={styles.footerText}>
          May Allah increase your understanding of the Quran
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryLight,
  },
  bismillah: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  surahName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  surahInfo: {
    fontSize: 13,
    color: colors.gray,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secondary,
    opacity: 0.3,
  },
  ornament: {
    fontSize: 16,
    color: colors.secondary,
  },
  textContainer: {
    flex: 1,
  },
  textContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ayahContainer: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
    borderRightWidth: 3,
    borderRightColor: colors.tertiary,
  },
  ayahSelected: {
    backgroundColor: '#F9F3ED',
    borderLeftColor: colors.primary,
    borderRightColor: colors.secondary,
  },
  ayahTextWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 8,
  },
  ayahTextWrapperRTL: {
    flexDirection: 'row',
  },
  ayahText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 32,
    color: colors.black,
    fontWeight: '500',
    textAlign: 'right',
  },
  ayahTextArabic: {
    fontSize: 20,
    lineHeight: 36,
    fontWeight: '600',
  },
  ayahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  ayahNumberRTL: {
    alignSelf: 'flex-end',
  },
  ayahNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.grayLight,
  },
  ayahDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  detailsText: {
    fontSize: 12,
    color: colors.gray,
  },
  shareText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#FDFBF7',
    borderTopWidth: 1,
    borderTopColor: colors.secondaryLight,
  },
  footerText: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  },
});
