package com.almuslim.app.data.local.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.almuslim.app.data.local.db.dao.*
import com.almuslim.app.data.local.db.entity.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.io.BufferedReader

/**
 * Al-Muslim Room database.
 *
 * Stores Quran data (114 surahs, 6236 ayahs), adhkar collections,
 * user bookmarks, adhkar progress, and favorites.
 *
 * The Quran and adhkar data is pre-populated on first launch from
 * bundled JSON assets. All text is stored as UTF-8 to prevent
 * encoding issues (Bug #11 fix).
 */
@Database(
    entities = [
        SurahEntity::class,
        AyahEntity::class,
        AdhkarCollectionEntity::class,
        AdhkarEntity::class,
        BookmarkEntity::class,
        AdhkarProgressEntity::class,
        FavoriteAdhkarEntity::class,
    ],
    version = 1,
    exportSchema = true,
)
abstract class AlMuslimDatabase : RoomDatabase() {

    abstract fun surahDao(): SurahDao
    abstract fun ayahDao(): AyahDao
    abstract fun adhkarDao(): AdhkarDao
    abstract fun bookmarkDao(): BookmarkDao
    abstract fun adhkarProgressDao(): AdhkarProgressDao
    abstract fun favoriteDao(): FavoriteDao

    companion object {
        const val DATABASE_NAME = "al_muslim_db"

        /**
         * Create the database with a callback that pre-populates
         * Quran and adhkar data from bundled JSON on first creation.
         */
        fun create(context: Context): AlMuslimDatabase {
            return Room.databaseBuilder(
                context.applicationContext,
                AlMuslimDatabase::class.java,
                DATABASE_NAME,
            )
                .addCallback(PrepopulateCallback(context))
                .fallbackToDestructiveMigration()
                .build()
        }
    }

    /**
     * Pre-populate the database with Quran and adhkar JSON data on creation.
     */
    private class PrepopulateCallback(
        private val context: Context,
    ) : Callback() {

        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            CoroutineScope(Dispatchers.IO).launch {
                val database = create(context)
                populateQuranData(context, database)
                populateAdhkarData(context, database)
            }
        }

        private suspend fun populateQuranData(context: Context, db: AlMuslimDatabase) {
            try {
                if (db.surahDao().count() > 0) return

                val jsonString = context.assets.open("quran_full.json")
                    .bufferedReader()
                    .use(BufferedReader::readText)

                val root = JSONObject(jsonString)
                val surahsObj = root.getJSONObject("surahs")
                val surahEntities = mutableListOf<SurahEntity>()
                val ayahEntities = mutableListOf<AyahEntity>()

                val keys = surahsObj.keys()
                while (keys.hasNext()) {
                    val key = keys.next()
                    val surahJson = surahsObj.getJSONObject(key)
                    val surahNumber = key.toIntOrNull() ?: continue

                    val name = surahJson.optString("name", "")
                    val englishName = surahJson.optString("englishName", name)
                    val type = surahJson.optString("type", "unknown")
                    val versesArray = surahJson.optJSONArray("verses")

                    surahEntities.add(
                        SurahEntity(
                            number = surahNumber,
                            name = name,
                            englishName = englishName,
                            numberOfAyahs = versesArray?.length() ?: 0,
                            revelationType = type,
                        )
                    )

                    if (versesArray != null) {
                        for (i in 0 until versesArray.length()) {
                            val verseJson = versesArray.getJSONObject(i)
                            ayahEntities.add(
                                AyahEntity(
                                    surahNumber = surahNumber,
                                    numberInSurah = verseJson.optInt("verse", i + 1),
                                    text = verseJson.optString("text", ""),
                                    globalNumber = verseJson.optInt("number", 0),
                                )
                            )
                        }
                    }
                }

                db.surahDao().insertAll(surahEntities.sortedBy { it.number })
                // Insert in chunks to avoid SQLite variable limit
                ayahEntities.chunked(500).forEach { chunk ->
                    db.ayahDao().insertAll(chunk)
                }
            } catch (e: Exception) {
                android.util.Log.e("AlMuslimDB", "Failed to populate Quran data", e)
            }
        }

        private suspend fun populateAdhkarData(context: Context, db: AlMuslimDatabase) {
            try {
                if (db.adhkarDao().count() > 0) return

                val jsonString = context.assets.open("adhkar.json")
                    .bufferedReader()
                    .use(BufferedReader::readText)

                val root = JSONObject(jsonString)
                val collectionsArray = root.getJSONArray("collections")
                val collectionEntities = mutableListOf<AdhkarCollectionEntity>()
                val adhkarEntities = mutableListOf<AdhkarEntity>()

                for (i in 0 until collectionsArray.length()) {
                    val collJson = collectionsArray.getJSONObject(i)
                    val category = collJson.getString("category")

                    collectionEntities.add(
                        AdhkarCollectionEntity(
                            category = category,
                            categoryName = collJson.getString("categoryName"),
                            categoryArabic = collJson.getString("categoryArabic"),
                            description = collJson.getString("description"),
                        )
                    )

                    val adhkarArray = collJson.getJSONArray("adhkar")
                    for (j in 0 until adhkarArray.length()) {
                        val adhkarJson = adhkarArray.getJSONObject(j)
                        adhkarEntities.add(
                            AdhkarEntity(
                                id = adhkarJson.getString("id"),
                                category = category,
                                text = adhkarJson.getString("text"),
                                englishTranslation = adhkarJson.getString("englishTranslation"),
                                count = adhkarJson.getInt("count"),
                                reference = adhkarJson.optString("reference", null),
                            )
                        )
                    }
                }

                db.adhkarDao().insertAllCollections(collectionEntities)
                db.adhkarDao().insertAllAdhkar(adhkarEntities)
            } catch (e: Exception) {
                android.util.Log.e("AlMuslimDB", "Failed to populate adhkar data", e)
            }
        }
    }
}
