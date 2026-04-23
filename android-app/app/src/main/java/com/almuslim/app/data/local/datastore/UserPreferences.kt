package com.almuslim.app.data.local.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.almuslim.app.domain.model.UserSettings
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "al_muslim_preferences")

/**
 * User preferences backed by Jetpack DataStore.
 *
 * Replaces the React Native AsyncStorage layer (src/core/storage.ts).
 * All preferences are observable via Flow for reactive UI updates.
 */
@Singleton
class UserPreferences @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private object Keys {
        val LANGUAGE = stringPreferencesKey("language")
        val THEME_MODE = stringPreferencesKey("theme_mode")
        val IS_AMOLED = booleanPreferencesKey("is_amoled")
        val NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
        val MADHAB = stringPreferencesKey("madhab")
        val CALCULATION_METHOD = stringPreferencesKey("calculation_method")
        val USE_24_HOUR = booleanPreferencesKey("use_24_hour_format")
        val HAPTICS_ENABLED = booleanPreferencesKey("haptics_enabled")
        val KEEP_SCREEN_AWAKE = booleanPreferencesKey("keep_screen_awake")
        val ONBOARDING_COMPLETE = booleanPreferencesKey("onboarding_complete")
        val USER_CITY = stringPreferencesKey("user_city")
        val USER_LATITUDE = doublePreferencesKey("user_latitude")
        val USER_LONGITUDE = doublePreferencesKey("user_longitude")
    }

    /**
     * Observe all user settings as a reactive Flow.
     */
    val settingsFlow: Flow<UserSettings> = context.dataStore.data
        .catch { emit(emptyPreferences()) }
        .map { prefs ->
            UserSettings(
                language = prefs[Keys.LANGUAGE] ?: "en",
                themeMode = prefs[Keys.THEME_MODE] ?: "system",
                isAmoled = prefs[Keys.IS_AMOLED] ?: false,
                notificationsEnabled = prefs[Keys.NOTIFICATIONS_ENABLED] ?: true,
                madhab = prefs[Keys.MADHAB] ?: "SHAFI",
                calculationMethod = prefs[Keys.CALCULATION_METHOD] ?: "MUSLIM_WORLD_LEAGUE",
                use24HourFormat = prefs[Keys.USE_24_HOUR] ?: true,
                hapticsEnabled = prefs[Keys.HAPTICS_ENABLED] ?: true,
                keepScreenAwake = prefs[Keys.KEEP_SCREEN_AWAKE] ?: false,
                onboardingComplete = prefs[Keys.ONBOARDING_COMPLETE] ?: false,
            )
        }

    val themeModeFlow: Flow<String> = context.dataStore.data
        .catch { emit(emptyPreferences()) }
        .map { it[Keys.THEME_MODE] ?: "system" }

    val isAmoledFlow: Flow<Boolean> = context.dataStore.data
        .catch { emit(emptyPreferences()) }
        .map { it[Keys.IS_AMOLED] ?: false }

    val languageFlow: Flow<String> = context.dataStore.data
        .catch { emit(emptyPreferences()) }
        .map { it[Keys.LANGUAGE] ?: "en" }

    val onboardingCompleteFlow: Flow<Boolean> = context.dataStore.data
        .catch { emit(emptyPreferences()) }
        .map { it[Keys.ONBOARDING_COMPLETE] ?: false }

    // ── Setters ──────────────────────────────────────────────────────────

    suspend fun setLanguage(language: String) {
        context.dataStore.edit { it[Keys.LANGUAGE] = language }
    }

    suspend fun setThemeMode(mode: String) {
        context.dataStore.edit { it[Keys.THEME_MODE] = mode }
    }

    suspend fun setAmoled(enabled: Boolean) {
        context.dataStore.edit { it[Keys.IS_AMOLED] = enabled }
    }

    suspend fun setNotificationsEnabled(enabled: Boolean) {
        context.dataStore.edit { it[Keys.NOTIFICATIONS_ENABLED] = enabled }
    }

    suspend fun setMadhab(madhab: String) {
        context.dataStore.edit { it[Keys.MADHAB] = madhab }
    }

    suspend fun setCalculationMethod(method: String) {
        context.dataStore.edit { it[Keys.CALCULATION_METHOD] = method }
    }

    suspend fun setUse24HourFormat(use24: Boolean) {
        context.dataStore.edit { it[Keys.USE_24_HOUR] = use24 }
    }

    suspend fun setHapticsEnabled(enabled: Boolean) {
        context.dataStore.edit { it[Keys.HAPTICS_ENABLED] = enabled }
    }

    suspend fun setKeepScreenAwake(enabled: Boolean) {
        context.dataStore.edit { it[Keys.KEEP_SCREEN_AWAKE] = enabled }
    }

    suspend fun setOnboardingComplete(complete: Boolean) {
        context.dataStore.edit { it[Keys.ONBOARDING_COMPLETE] = complete }
    }

    suspend fun setUserLocation(city: String?, latitude: Double, longitude: Double) {
        context.dataStore.edit { prefs ->
            city?.let { prefs[Keys.USER_CITY] = it }
            prefs[Keys.USER_LATITUDE] = latitude
            prefs[Keys.USER_LONGITUDE] = longitude
        }
    }
}
