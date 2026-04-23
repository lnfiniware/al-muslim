package com.almuslim.app.domain.model

/**
 * Qiblah direction data from user's location.
 */
data class QiblahDirection(
    val angle: Double,
    val direction: String,
)

/**
 * Hijri (Islamic) calendar date.
 */
data class HijriDate(
    val year: Int,
    val month: Int,
    val day: Int,
    val monthName: String,
    val monthNameArabic: String,
) {
    fun formatted(arabic: Boolean = false): String {
        val name = if (arabic) monthNameArabic else monthName
        return "$day $name $year"
    }
}

/**
 * User location data.
 */
data class LocationData(
    val city: String? = null,
    val country: String? = null,
    val latitude: Double,
    val longitude: Double,
    val accuracy: Float? = null,
)

/**
 * User settings / preferences.
 */
data class UserSettings(
    val language: String = "en",
    val themeMode: String = "system",
    val isAmoled: Boolean = false,
    val notificationsEnabled: Boolean = true,
    val madhab: String = "SHAFI",
    val calculationMethod: String = "MUSLIM_WORLD_LEAGUE",
    val use24HourFormat: Boolean = true,
    val hapticsEnabled: Boolean = true,
    val keepScreenAwake: Boolean = false,
    val onboardingComplete: Boolean = false,
)
