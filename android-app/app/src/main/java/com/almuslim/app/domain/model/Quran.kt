package com.almuslim.app.domain.model

/**
 * Quran Surah metadata.
 */
data class Surah(
    val number: Int,
    val name: String,
    val englishName: String,
    val numberOfAyahs: Int,
    val revelationType: RevelationType,
)

enum class RevelationType(val displayName: String) {
    MECCAN("Meccan"),
    MEDINAN("Medinan"),
    UNKNOWN("Unknown"),
}

/**
 * A single verse (ayah) in the Quran.
 */
data class Ayah(
    val number: Int,
    val text: String,
    val numberInSurah: Int,
    val surahNumber: Int,
    val juz: Int? = null,
    val page: Int? = null,
)

/**
 * Full surah with all its verses.
 */
data class SurahDetail(
    val surah: Surah,
    val ayahs: List<Ayah>,
)

/**
 * A bookmark for a specific ayah.
 */
data class QuranBookmark(
    val surahNumber: Int,
    val ayahNumber: Int,
    val surahName: String,
    val createdAt: Long = System.currentTimeMillis(),
)
