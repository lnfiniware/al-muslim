import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { adhkarService, AdhkarCategory, Adhkar as AdhkarType } from '@services/adhkarService';
import { storageService } from '@core/storage';
import { AdhkarCard } from '@components/AdhkarCard';

type AdhkarCategoryType = 'morning' | 'evening' | 'before_sleep' | 'after_prayer' | 'miscellaneous';

export default function AdhkarScreen() {
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategoryType>('morning');
  const [adhkarList, setAdhkarList] = useState<AdhkarType[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdhkar();
  }, [selectedCategory]);

  const loadAdhkar = async () => {
    try {
      setLoading(true);
      const collection = adhkarService.getAdhkarByCategory(selectedCategory);
      if (collection) {
        setAdhkarList(collection.adhkar);
      }

      const savedProgress = await storageService.getAdhkarProgress();
      setProgress(savedProgress);
    } catch (error) {
      console.error('Error loading adhkar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (adhkarId: string) => {
    const currentCount = progress[adhkarId] || 0;
    const adhkar = adhkarList.find(a => a.id === adhkarId);
    
    if (adhkar && currentCount < adhkar.count) {
      const newCount = currentCount + 1;
      const newProgress = { ...progress, [adhkarId]: newCount };
      setProgress(newProgress);
      await storageService.updateAdhkarProgress(adhkarId, newCount);
    }
  };

  const handleReset = async (adhkarId: string) => {
    const newProgress = { ...progress };
    delete newProgress[adhkarId];
    setProgress(newProgress);
    await storageService.updateAdhkarProgress(adhkarId, 0);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#006a4e" />
      </View>
    );
  }

  const categoryOptions = [
    { label: 'Morning', value: 'morning' as const },
    { label: 'Evening', value: 'evening' as const },
    { label: 'Sleep', value: 'before_sleep' as const },
    { label: 'Prayer', value: 'after_prayer' as const },
    { label: 'Other', value: 'miscellaneous' as const },
  ];

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={selectedCategory}
        onValueChange={value => setSelectedCategory(value as AdhkarCategoryType)}
        buttons={categoryOptions}
        style={styles.segmentButtons}
      />

      <FlatList
        data={adhkarList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AdhkarCard
            id={item.id}
            arabicText={item.text}
            englishText={item.englishTranslation}
            targetCount={item.count}
            currentCount={progress[item.id] || 0}
            reference={item.reference}
            onIncrement={handleIncrement}
            onReset={handleReset}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  segmentButtons: {
    margin: 12,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
});
