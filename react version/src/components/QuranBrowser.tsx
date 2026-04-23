import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Modal,
  I18nManager,
} from 'react-native';
import { Text, Searchbar, IconButton, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { i18n } from '@core/i18n';
import { getSurahsList, getSurahByNumber } from '@data/quran_complete';
import quranData from '@data/quran_full.json';
import type { SurahInfo } from '@data/quran_complete';

export function QuranBrowser() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const isArabic = i18n.isArabic();
  const scaleAnim = useSharedValue(1);

  const surahs = useMemo(() => {
    const list = getSurahsList();
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      surah =>
        surah.name.toLowerCase().includes(query) ||
        surah.englishName.toLowerCase().includes(query) ||
        String(surah.number).includes(query)
    );
  }, [searchQuery]);

  const selectedSurahData = useMemo(() => {
    if (!selectedSurah) return null;
    return getSurahByNumber(selectedSurah);
  }, [selectedSurah]);

  const handleSurahPress = (number: number) => {
    scaleAnim.value = withSpring(1.05, { damping: 8 });
    setTimeout(() => {
      scaleAnim.value = withSpring(1, { damping: 8 });
      setSelectedSurah(number);
      setShowSurahPicker(false);
    }, 100);
  };

  const handlePrevious = useCallback(() => {
    if (selectedSurah && selectedSurah > 1) {
      handleSurahPress(selectedSurah - 1);
    }
  }, [selectedSurah]);

  const handleNext = useCallback(() => {
    if (selectedSurah && selectedSurah < 114) {
      handleSurahPress(selectedSurah + 1);
    }
  }, [selectedSurah]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const getVerses = useCallback((surahNumber: number) => {
    const surahKey = String(surahNumber);
    const surahData = (quranData as any).surahs[surahKey];
    return surahData?.verses || [];
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📖 {i18n.t('quran.title')}</Text>
          <Text style={styles.headerSubtitle}>Holy Quran</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={i18n.t('quran.search')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={{ textAlign: isArabic ? 'right' : 'left' }}
        />
      </View>

      {!selectedSurah ? (
        <Animated.View entering={FadeIn} style={{ flex: 1 }}>
          {/* Surah List */}
          <FlatList
            data={surahs}
            keyExtractor={item => String(item.number)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSurahPress(item.number)}
                style={({ pressed }) => [
                  styles.surahListItem,
                  pressed && styles.surahListItemPressed,
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.surahBadge}
                >
                  <Text style={styles.surahNumber}>{item.number}</Text>
                </LinearGradient>

                <View style={[styles.surahDetails, { flexDirection: isArabic ? 'row-reverse' : 'row' }]}>
                  <View style={isArabic ? { marginRight: 12 } : { marginLeft: 12 }}>
                    <Text style={styles.surahName}>{item.name}</Text>
                    <Text style={styles.surahEnglish}>{item.englishName}</Text>
                  </View>
                  <View style={styles.surahMeta}>
                    <Text style={styles.metaText}>{item.verses} {i18n.t('quran.verses')}</Text>
                    <Text style={[styles.metaText, { fontSize: 11, marginTop: 2 }]}>
                      {item.type === 'Meccan' ? '🕌 Makkah' : '🕌 Madinah'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{i18n.t('quran.noResults')}</Text>
              </View>
            }
          />
        </Animated.View>
      ) : (
        <Animated.View entering={SlideInUp} style={{ flex: 1 }}>
          {/* Mushaf View */}
          {selectedSurahData && (
            <ScrollView style={styles.mushafContainer} showsVerticalScrollIndicator={false}>
              {/* Surah Header */}
              <LinearGradient
                colors={['rgba(27, 94, 74, 0.95)', 'rgba(5, 85, 64, 0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mushafHeader}
              >
                <Text style={styles.mushafBismillah}>بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</Text>
                <Text style={styles.mushafTitle}>{selectedSurahData.name}</Text>
                <Text style={styles.mushafTitleEnglish}>{selectedSurahData.englishName}</Text>
                <View style={styles.dividerLine} />
                <View style={styles.surahInfoRow}>
                  <Text style={styles.surahInfoText}>
                    📍 Surah {selectedSurahData.number}
                  </Text>
                  <Text style={styles.surahInfoText}>
                    {selectedSurahData.verses} {i18n.t('quran.verses')}
                  </Text>
                  <Text style={styles.surahInfoText}>
                    {selectedSurahData.type === 'Meccan' ? '🕌 Makkah' : '🕌 Madinah'}
                  </Text>
                </View>
              </LinearGradient>

              {/* Quranic Verses */}
              <View style={styles.versesContainer}>
                {getVerses(selectedSurahData.number).map((verse: any, i: number) => (
                  <Animated.View
                    key={i}
                    style={styles.verseCard}
                    entering={FadeIn.delay(i * 50)}
                  >
                    <View style={styles.verseBadge}>
                      <Text style={styles.verseNumber}>{i + 1}</Text>
                    </View>
                    <View style={styles.verseContent}>
                      <View style={[styles.verseTextContainer, { alignItems: 'center' }]}>
                        <Text
                          style={[
                            styles.verseText,
                            {
                              textAlign: isArabic ? 'right' : 'center',
                              writingDirection: isArabic ? 'rtl' : 'ltr',
                            },
                          ]}
                        >
                          {verse.text}
                        </Text>
                        {verse.translation && (
                          <Text
                            style={[
                              styles.verseTranslation,
                              {
                                textAlign: isArabic ? 'right' : 'center',
                                writingDirection: isArabic ? 'rtl' : 'ltr',
                              },
                            ]}
                          >
                            {verse.translation}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Navigation Footer */}
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navigationFooter}
          >
            <Pressable
              onPress={handlePrevious}
              disabled={selectedSurah === 1}
              style={[styles.navButton, selectedSurah === 1 && styles.navButtonDisabled]}
            >
              <Text style={styles.navButtonText}>← {i18n.t('quran.previous')}</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowSurahPicker(true)}
              style={styles.navCenterButton}
            >
              <Text style={styles.navCenterText}>{selectedSurahData?.number} / 114</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              disabled={selectedSurah === 114}
              style={[styles.navButton, selectedSurah === 114 && styles.navButtonDisabled]}
            >
              <Text style={styles.navButtonText}>{i18n.t('quran.next')} →</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Back Button */}
      {selectedSurah && (
        <Pressable
          onPress={() => setSelectedSurah(null)}
          style={styles.backButton}
        >
          <View style={styles.backButtonContent}>
            <Text style={styles.backButtonText}>◄ List</Text>
          </View>
        </Pressable>
      )}

      {/* Surah Picker Modal */}
      <Modal
        visible={showSurahPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSurahPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Surah</Text>
              <Pressable onPress={() => setShowSurahPicker(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </Pressable>
            </View>

            <FlatList
              data={getSurahsList()}
              keyExtractor={item => String(item.number)}
              numColumns={3}
              contentContainerStyle={styles.pickerGrid}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSurahPress(item.number)}
                  style={[
                    styles.pickerItem,
                    selectedSurah === item.number && styles.pickerItemSelected,
                  ]}
                >
                  <LinearGradient
                    colors={
                      selectedSurah === item.number
                        ? [colors.secondary, colors.secondaryDark]
                        : [colors.primaryLight, colors.primary]
                    }
                    style={styles.pickerItemGradient}
                  >
                    <Text style={styles.pickerItemNumber}>{item.number}</Text>
                    <Text style={styles.pickerItemNameShort}>
                      {item.name.substring(0, 3)}
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchbar: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  surahListItem: {
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  surahListItemPressed: {
    opacity: 0.7,
  },
  surahBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  surahDetails: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  surahEnglish: {
    fontSize: 14,
    color: '#666',
  },
  surahMeta: {
    alignItems: 'flex-end',
  },
  metaText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  mushafContainer: {
    flex: 1,
    paddingBottom: 70,
    backgroundColor: '#1a1a1a',
  },
  mushafHeader: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 165, 116, 0.3)',
  },
  mushafBismillah: {
    fontSize: 28,
    color: '#d4a574',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  mushafTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#e8e8e8',
    marginBottom: 8,
    textAlign: 'center',
  },
  mushafTitleEnglish: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  dividerLine: {
    width: 80,
    height: 1,
    backgroundColor: '#d4a574',
    marginBottom: 20,
  },
  surahInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 165, 116, 0.2)',
  },
  surahInfoText: {
    color: '#999',
    fontSize: 11,
    fontWeight: '500',
  },
  versesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  verseCard: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginBottom: 28,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
  },
  verseBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#d4a574',
    backgroundColor: 'transparent',
  },
  verseNumber: {
    color: '#d4a574',
    fontSize: 12,
    fontWeight: '700',
  },
  verseContent: {
    flex: 1,
    width: '100%',
  },
  verseTextContainer: {
    flex: 1,
    width: '100%',
  },
  verseText: {
    fontSize: 22,
    lineHeight: 42,
    color: '#e8e8e8',
    fontWeight: '500',
    textAlign: 'center',
  },
  verseTranslation: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 0,
    textAlign: 'center',
  },
  navigationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  navCenterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  navCenterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 16,
    zIndex: 10,
  },
  backButtonContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#999',
  },
  pickerGrid: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
  },
  pickerItemSelected: {},
  pickerItemGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  pickerItemNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  pickerItemNameShort: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
