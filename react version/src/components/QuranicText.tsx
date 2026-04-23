import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

interface QuranicTextProps {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  englishTranslation?: string;
  bookmarked?: boolean;
  onBookmarkPress?: () => void;
}

export const QuranicText: React.FC<QuranicTextProps> = ({
  surahName,
  surahNumber,
  ayahNumber,
  arabicText,
  englishTranslation,
  bookmarked = false,
  onBookmarkPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.surahName}>{surahName}</Text>
          <Text style={styles.surahReference}>
            Surah {surahNumber}, Ayah {ayahNumber}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.arabicText}>{arabicText}</Text>

        {englishTranslation && (
          <>
            <View style={styles.divider} />
            <Text style={styles.englishText}>{englishTranslation}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006a4e',
  },
  surahReference: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: 12,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    color: '#121212',
    fontWeight: '500',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  englishText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginBottom: 16,
  },
});
