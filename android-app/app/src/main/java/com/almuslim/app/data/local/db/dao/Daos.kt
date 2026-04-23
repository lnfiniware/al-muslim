package com.almuslim.app.data.local.db.dao

import androidx.room.*
import com.almuslim.app.data.local.db.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface SurahDao {
    @Query("SELECT * FROM surahs ORDER BY number ASC")
    fun getAllSurahs(): Flow<List<SurahEntity>>

    @Query("SELECT * FROM surahs WHERE number = :number")
    suspend fun getSurahByNumber(number: Int): SurahEntity?

    @Query("""
        SELECT * FROM surahs 
        WHERE name LIKE '%' || :query || '%' 
           OR englishName LIKE '%' || :query || '%'
        ORDER BY number ASC
    """)
    fun searchSurahs(query: String): Flow<List<SurahEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(surahs: List<SurahEntity>)

    @Query("SELECT COUNT(*) FROM surahs")
    suspend fun count(): Int
}

@Dao
interface AyahDao {
    @Query("SELECT * FROM ayahs WHERE surahNumber = :surahNumber ORDER BY numberInSurah ASC")
    fun getAyahsBySurah(surahNumber: Int): Flow<List<AyahEntity>>

    @Query("SELECT * FROM ayahs WHERE surahNumber = :surahNumber ORDER BY numberInSurah ASC")
    suspend fun getAyahsBySurahSync(surahNumber: Int): List<AyahEntity>

    @Query("SELECT * FROM ayahs WHERE surahNumber = :surahNumber AND numberInSurah = :ayahNumber")
    suspend fun getAyah(surahNumber: Int, ayahNumber: Int): AyahEntity?

    @Query("""
        SELECT * FROM ayahs 
        WHERE text LIKE '%' || :query || '%'
        LIMIT 100
    """)
    fun searchAyahs(query: String): Flow<List<AyahEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(ayahs: List<AyahEntity>)

    @Query("SELECT COUNT(*) FROM ayahs")
    suspend fun count(): Int
}

@Dao
interface AdhkarDao {
    @Query("SELECT * FROM adhkar WHERE category = :category")
    fun getAdhkarByCategory(category: String): Flow<List<AdhkarEntity>>

    @Query("SELECT * FROM adhkar_collections")
    fun getAllCollections(): Flow<List<AdhkarCollectionEntity>>

    @Query("""
        SELECT * FROM adhkar 
        WHERE text LIKE '%' || :query || '%' 
           OR englishTranslation LIKE '%' || :query || '%'
    """)
    fun searchAdhkar(query: String): Flow<List<AdhkarEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllAdhkar(adhkar: List<AdhkarEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllCollections(collections: List<AdhkarCollectionEntity>)

    @Query("SELECT COUNT(*) FROM adhkar")
    suspend fun count(): Int
}

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM bookmarks ORDER BY createdAt DESC")
    fun getAllBookmarks(): Flow<List<BookmarkEntity>>

    @Query("SELECT EXISTS(SELECT 1 FROM bookmarks WHERE surahNumber = :surahNumber AND ayahNumber = :ayahNumber)")
    fun isBookmarked(surahNumber: Int, ayahNumber: Int): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addBookmark(bookmark: BookmarkEntity)

    @Query("DELETE FROM bookmarks WHERE surahNumber = :surahNumber AND ayahNumber = :ayahNumber")
    suspend fun removeBookmark(surahNumber: Int, ayahNumber: Int)

    @Query("DELETE FROM bookmarks")
    suspend fun clearAll()
}

@Dao
interface AdhkarProgressDao {
    @Query("SELECT * FROM adhkar_progress")
    fun getAllProgress(): Flow<List<AdhkarProgressEntity>>

    @Query("SELECT * FROM adhkar_progress WHERE adhkarId = :id")
    suspend fun getProgress(id: String): AdhkarProgressEntity?

    @Upsert
    suspend fun upsertProgress(progress: AdhkarProgressEntity)

    @Query("DELETE FROM adhkar_progress WHERE adhkarId = :id")
    suspend fun resetProgress(id: String)

    @Query("DELETE FROM adhkar_progress")
    suspend fun clearAll()
}

@Dao
interface FavoriteDao {
    @Query("SELECT * FROM favorites ORDER BY addedAt DESC")
    fun getAllFavorites(): Flow<List<FavoriteAdhkarEntity>>

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE adhkarId = :id)")
    fun isFavorite(id: String): Flow<Boolean>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addFavorite(favorite: FavoriteAdhkarEntity)

    @Query("DELETE FROM favorites WHERE adhkarId = :id")
    suspend fun removeFavorite(id: String)
}
