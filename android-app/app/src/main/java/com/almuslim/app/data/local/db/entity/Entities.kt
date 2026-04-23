package com.almuslim.app.data.local.db.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "surahs")
data class SurahEntity(
    @PrimaryKey val number: Int,
    val name: String,
    val englishName: String,
    val numberOfAyahs: Int,
    val revelationType: String,
)

@Entity(
    tableName = "ayahs",
    primaryKeys = ["surahNumber", "numberInSurah"],
)
data class AyahEntity(
    val surahNumber: Int,
    val numberInSurah: Int,
    val text: String,
    val globalNumber: Int = 0,
    val juz: Int? = null,
    val page: Int? = null,
)

@Entity(tableName = "adhkar_collections")
data class AdhkarCollectionEntity(
    @PrimaryKey val category: String,
    val categoryName: String,
    val categoryArabic: String,
    val description: String,
)

@Entity(
    tableName = "adhkar",
    primaryKeys = ["id"],
)
data class AdhkarEntity(
    val id: String,
    val category: String,
    val text: String,
    val englishTranslation: String,
    val count: Int,
    val reference: String? = null,
)

@Entity(tableName = "bookmarks")
data class BookmarkEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val surahNumber: Int,
    val ayahNumber: Int,
    val surahName: String,
    val createdAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "adhkar_progress")
data class AdhkarProgressEntity(
    @PrimaryKey val adhkarId: String,
    val currentCount: Int,
    val lastUpdated: Long = System.currentTimeMillis(),
)

@Entity(tableName = "favorites")
data class FavoriteAdhkarEntity(
    @PrimaryKey val adhkarId: String,
    val addedAt: Long = System.currentTimeMillis(),
)
