package com.almuslim.app.di

import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent

/**
 * App-level module for bindings that don't fit in specialized modules.
 * Services (PrayerCalculationService, QiblahCalculationService, etc.)
 * are constructor-injected singletons and don't need explicit provides.
 */
@Module
@InstallIn(SingletonComponent::class)
object AppModule
