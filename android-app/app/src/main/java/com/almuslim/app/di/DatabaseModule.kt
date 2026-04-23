package com.almuslim.app.di

import android.content.Context
import com.almuslim.app.data.local.db.AlMuslimDatabase
import com.almuslim.app.data.local.db.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AlMuslimDatabase {
        return AlMuslimDatabase.create(context)
    }

    @Provides fun provideSurahDao(db: AlMuslimDatabase): SurahDao = db.surahDao()
    @Provides fun provideAyahDao(db: AlMuslimDatabase): AyahDao = db.ayahDao()
    @Provides fun provideAdhkarDao(db: AlMuslimDatabase): AdhkarDao = db.adhkarDao()
    @Provides fun provideBookmarkDao(db: AlMuslimDatabase): BookmarkDao = db.bookmarkDao()
    @Provides fun provideAdhkarProgressDao(db: AlMuslimDatabase): AdhkarProgressDao = db.adhkarProgressDao()
    @Provides fun provideFavoriteDao(db: AlMuslimDatabase): FavoriteDao = db.favoriteDao()
}
