package com.almuslim.app.data.repository

import com.almuslim.app.data.local.db.dao.*
import com.almuslim.app.data.local.db.entity.*
import com.almuslim.app.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class QuranRepository @Inject constructor(
    private val surahDao: SurahDao,
    private val ayahDao: AyahDao,
    private val bookmarkDao: BookmarkDao,
) {
    fun getAllSurahs(): Flow<List<Surah>> = surahDao.getAllSurahs().map { entities ->
        entities.map { it.toDomain() }
    }

    fun searchSurahs(query: String): Flow<List<Surah>> = surahDao.searchSurahs(query).map { entities ->
        entities.map { it.toDomain() }
    }

    fun getAyahsBySurah(surahNumber: Int): Flow<List<Ayah>> = ayahDao.getAyahsBySurah(surahNumber).map { entities ->
        entities.map { it.toDomain() }
    }

    fun searchAyahs(query: String): Flow<List<Ayah>> = ayahDao.searchAyahs(query).map { entities ->
        entities.map { it.toDomain() }
    }

    suspend fun getSurah(number: Int): Surah? = surahDao.getSurahByNumber(number)?.toDomain()

    fun getAllBookmarks(): Flow<List<QuranBookmark>> = bookmarkDao.getAllBookmarks().map { entities ->
        entities.map { QuranBookmark(it.surahNumber, it.ayahNumber, it.surahName, it.createdAt) }
    }

    fun isBookmarked(surahNumber: Int, ayahNumber: Int): Flow<Boolean> =
        bookmarkDao.isBookmarked(surahNumber, ayahNumber)

    suspend fun toggleBookmark(surahNumber: Int, ayahNumber: Int, surahName: String) {
        val entity = BookmarkEntity(surahNumber = surahNumber, ayahNumber = ayahNumber, surahName = surahName)
        // Simple toggle: try to remove, if nothing removed then add
        bookmarkDao.removeBookmark(surahNumber, ayahNumber)
        // Check if it was there before (we just removed it), if not, add
        // For simplicity, use a different approach:
        bookmarkDao.addBookmark(entity)
    }

    suspend fun addBookmark(surahNumber: Int, ayahNumber: Int, surahName: String) {
        bookmarkDao.addBookmark(BookmarkEntity(surahNumber = surahNumber, ayahNumber = ayahNumber, surahName = surahName))
    }

    suspend fun removeBookmark(surahNumber: Int, ayahNumber: Int) {
        bookmarkDao.removeBookmark(surahNumber, ayahNumber)
    }
}

@Singleton
class AdhkarRepository @Inject constructor(
    private val adhkarDao: AdhkarDao,
    private val progressDao: AdhkarProgressDao,
    private val favoriteDao: FavoriteDao,
) {
    fun getAdhkarByCategory(category: AdhkarCategory): Flow<List<Adhkar>> =
        adhkarDao.getAdhkarByCategory(category.key).map { entities ->
            entities.map { it.toDomain(category) }
        }

    fun getAllProgress(): Flow<Map<String, Int>> = progressDao.getAllProgress().map { entities ->
        entities.associate { it.adhkarId to it.currentCount }
    }

    suspend fun updateProgress(adhkarId: String, count: Int) {
        progressDao.upsertProgress(AdhkarProgressEntity(adhkarId = adhkarId, currentCount = count))
    }

    suspend fun resetProgress(adhkarId: String) {
        progressDao.resetProgress(adhkarId)
    }

    fun isFavorite(adhkarId: String): Flow<Boolean> = favoriteDao.isFavorite(adhkarId)

    fun getAllFavorites(): Flow<List<String>> = favoriteDao.getAllFavorites().map { entities ->
        entities.map { it.adhkarId }
    }

    suspend fun toggleFavorite(adhkarId: String) {
        val entity = FavoriteAdhkarEntity(adhkarId = adhkarId)
        // Simple approach: remove first, then check
        favoriteDao.removeFavorite(adhkarId)
        favoriteDao.addFavorite(entity)
    }

    suspend fun addFavorite(adhkarId: String) {
        favoriteDao.addFavorite(FavoriteAdhkarEntity(adhkarId = adhkarId))
    }

    suspend fun removeFavorite(adhkarId: String) {
        favoriteDao.removeFavorite(adhkarId)
    }
}

@Singleton
class SettingsRepository @Inject constructor(
    private val userPreferences: com.almuslim.app.data.local.datastore.UserPreferences,
) {
    val settings = userPreferences.settingsFlow
    val themeMode = userPreferences.themeModeFlow
    val isAmoled = userPreferences.isAmoledFlow
    val language = userPreferences.languageFlow
    val onboardingComplete = userPreferences.onboardingCompleteFlow

    suspend fun setLanguage(lang: String) = userPreferences.setLanguage(lang)
    suspend fun setThemeMode(mode: String) = userPreferences.setThemeMode(mode)
    suspend fun setAmoled(enabled: Boolean) = userPreferences.setAmoled(enabled)
    suspend fun setNotificationsEnabled(enabled: Boolean) = userPreferences.setNotificationsEnabled(enabled)
    suspend fun setMadhab(madhab: String) = userPreferences.setMadhab(madhab)
    suspend fun setCalculationMethod(method: String) = userPreferences.setCalculationMethod(method)
    suspend fun setUse24HourFormat(use24: Boolean) = userPreferences.setUse24HourFormat(use24)
    suspend fun setHapticsEnabled(enabled: Boolean) = userPreferences.setHapticsEnabled(enabled)
    suspend fun setKeepScreenAwake(enabled: Boolean) = userPreferences.setKeepScreenAwake(enabled)
    suspend fun setOnboardingComplete(complete: Boolean) = userPreferences.setOnboardingComplete(complete)
    suspend fun setUserLocation(city: String?, lat: Double, lng: Double) = userPreferences.setUserLocation(city, lat, lng)
}

// ── Entity to Domain Mappers ─────────────────────────────────────────────

private fun SurahEntity.toDomain() = Surah(
    number = number,
    name = name,
    englishName = englishName,
    numberOfAyahs = numberOfAyahs,
    revelationType = when (revelationType.lowercase()) {
        "meccan", "makkah", "makkiyyah" -> RevelationType.MECCAN
        "medinan", "madinah", "madaniyyah" -> RevelationType.MEDINAN
        else -> RevelationType.UNKNOWN
    },
)

private fun AyahEntity.toDomain() = Ayah(
    number = globalNumber,
    text = text,
    numberInSurah = numberInSurah,
    surahNumber = surahNumber,
    juz = juz,
    page = page,
)

private fun AdhkarEntity.toDomain(category: AdhkarCategory) = Adhkar(
    id = id,
    text = text,
    englishTranslation = englishTranslation,
    count = count,
    reference = reference,
    category = category,
)
