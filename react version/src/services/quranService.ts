// Quran Service - Provides access to Quranic content
import quranData from '@data/quran_full.json';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah?: number;
  juz?: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQurter?: number;
  sajda?: boolean;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

// Convert quran data object to array format
const getSurahsArray = () => {
  const surahsObj = (quranData as any).surahs;
  const surahsArray: any[] = [];

  // Convert object keyed by string numbers to array
  for (const key in surahsObj) {
    const surah = surahsObj[key];
    if (surah && surah.name) {
      const surahNumber = parseInt(key);
      surahsArray[surahNumber - 1] = {
        ...surah,
        number: surahNumber,
        numberOfAyahs: surah.verses ? surah.verses.length : 0,
        revelationType: surah.type || 'unknown',
        ayahs: (surah.verses || []).map((v: any) => ({
          number: v.verse || v.number,
          text: v.text || v.othmani || '',
          numberInSurah: v.verse || v.number,
        })),
      };
    }
  }

  return surahsArray.filter(Boolean);
};

export const quranService = {
  getAllSurahs(): Surah[] {
    const surahsArray = getSurahsArray();
    return surahsArray.map(surah => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName || surah.name,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
    }));
  },

  getSurah(surahNumber: number): SurahDetail | null {
    const surahsArray = getSurahsArray();
    const surah = surahsArray.find((s: any) => s.number === surahNumber);
    if (!surah) return null;

    return {
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName || surah.name,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
      ayahs: surah.ayahs || [],
    };
  },

  getAyah(surahNumber: number, ayahNumber: number): Ayah | null {
    const surah = this.getSurah(surahNumber);
    if (!surah) return null;

    return surah.ayahs.find((a: any) => a.numberInSurah === ayahNumber) || null;
  },

  searchAyahs(query: string): Array<{ surah: Surah; ayah: Ayah }> {
    const results: Array<{ surah: Surah; ayah: Ayah }> = [];
    const lowerQuery = query.toLowerCase();
    const surahsArray = getSurahsArray();

    surahsArray.forEach((surah: any) => {
      const surahInfo: Surah = {
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName || surah.name,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
      };

      (surah.ayahs || []).forEach((ayah: any) => {
        if (ayah.text && ayah.text.toLowerCase().includes(lowerQuery)) {
          results.push({ surah: surahInfo, ayah });
        }
      });
    });

    return results;
  },

  searchSurahs(query: string): Surah[] {
    const lowerQuery = query.toLowerCase();
    const surahsArray = getSurahsArray();

    return surahsArray
      .filter((surah: any) =>
        surah.name.toLowerCase().includes(lowerQuery) ||
        (surah.englishName && surah.englishName.toLowerCase().includes(lowerQuery))
      )
      .map((surah: any) => ({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName || surah.name,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
      }));
  },

  getRandomAyah(): Ayah | null {
    const surahsArray = getSurahsArray();
    if (surahsArray.length === 0) return null;

    const surah = surahsArray[Math.floor(Math.random() * surahsArray.length)];
    const ayahs = surah.ayahs || [];
    if (ayahs.length === 0) return null;

    return ayahs[Math.floor(Math.random() * ayahs.length)];
  },

  getTotalAyahs(): number {
    const surahsArray = getSurahsArray();
    return surahsArray.reduce((total: number, surah: any) => total + (surah.numberOfAyahs || 0), 0);
  },
};
