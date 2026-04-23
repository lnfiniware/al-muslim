// Adhkar Service - Provides Islamic remembrances
import adhkarData from '@data/adhkar.json';

export type AdhkarCategory = 'morning' | 'evening' | 'before_sleep' | 'after_prayer' | 'miscellaneous';

export interface Adhkar {
  id: string;
  text: string;
  englishTranslation: string;
  count: number;
  reference?: string;
}

export interface AdhkarCollection {
  category: AdhkarCategory;
  categoryName: string;
  categoryArabic: string;
  description: string;
  adhkar: Adhkar[];
}

export const adhkarService = {
  getAllAdhkar(): AdhkarCollection[] {
    return (adhkarData.collections as AdhkarCollection[]) || [];
  },

  getAdhkarByCategory(category: AdhkarCategory): AdhkarCollection | undefined {
    return (adhkarData.collections as AdhkarCollection[]).find(collection => collection.category === category);
  },

  searchAdhkar(query: string): Adhkar[] {
    const lowerQuery = query.toLowerCase();
    const results: Adhkar[] = [];

    adhkarData.collections.forEach(collection => {
      collection.adhkar.forEach(adhkar => {
        if (
          adhkar.text.toLowerCase().includes(lowerQuery) ||
          adhkar.englishTranslation.toLowerCase().includes(lowerQuery)
        ) {
          results.push(adhkar);
        }
      });
    });

    return results;
  },

  getRandomAdhkar(): Adhkar | null {
    const collections = adhkarData.collections;
    if (collections.length === 0) return null;

    const randomCollection = collections[Math.floor(Math.random() * collections.length)];
    if (randomCollection.adhkar.length === 0) return null;

    return randomCollection.adhkar[Math.floor(Math.random() * randomCollection.adhkar.length)];
  },

  getTotalAdhkar(): number {
    return adhkarData.collections.reduce((total, collection) => total + collection.adhkar.length, 0);
  },
};
