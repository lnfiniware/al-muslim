import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

interface SurahListItemProps {
  surahNumber: number;
  surahName: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  onPress: () => void;
}

export const SurahListItem: React.FC<SurahListItemProps> = ({
  surahNumber,
  surahName,
  englishName,
  numberOfAyahs,
  revelationType,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{surahNumber}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.surahName}>{surahName}</Text>
        <Text style={styles.englishName}>{englishName}</Text>
        <Text style={styles.metadata}>
          {numberOfAyahs} Ayahs • {revelationType}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#006a4e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
    marginBottom: 2,
  },
  englishName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metadata: {
    fontSize: 12,
    color: '#999',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
});
