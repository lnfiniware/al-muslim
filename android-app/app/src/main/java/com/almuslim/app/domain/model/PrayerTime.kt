package com.almuslim.app.domain.model

import java.time.LocalDateTime
import java.time.LocalTime

/**
 * Represents a single prayer time entry.
 */
data class PrayerTime(
    val name: PrayerName,
    val time: LocalDateTime,
    val timeString: String,
)

enum class PrayerName(val displayName: String, val arabicName: String) {
    FAJR("Fajr", "الفجر"),
    SUNRISE("Sunrise", "الشروق"),
    DHUHR("Dhuhr", "الظهر"),
    ASR("Asr", "العصر"),
    MAGHRIB("Maghrib", "المغرب"),
    ISHA("Isha", "العشاء"),
}

/**
 * All prayer times for a single day.
 */
data class DailyPrayers(
    val fajr: PrayerTime,
    val sunrise: PrayerTime,
    val dhuhr: PrayerTime,
    val asr: PrayerTime,
    val maghrib: PrayerTime,
    val isha: PrayerTime,
    val date: java.time.LocalDate,
) {
    /** Returns all prayers as a list, ordered chronologically. */
    fun toList(): List<PrayerTime> = listOf(fajr, sunrise, dhuhr, asr, maghrib, isha)

    /** Returns only obligatory prayers (excludes sunrise). */
    fun obligatoryPrayers(): List<PrayerTime> = listOf(fajr, dhuhr, asr, maghrib, isha)
}

/**
 * Prayer time countdown representation.
 */
data class PrayerCountdown(
    val hours: Int,
    val minutes: Int,
    val seconds: Int,
) {
    fun formatted(): String = buildString {
        append(hours.toString().padStart(2, '0'))
        append(':')
        append(minutes.toString().padStart(2, '0'))
        append(':')
        append(seconds.toString().padStart(2, '0'))
    }

    val totalSeconds: Long get() = hours * 3600L + minutes * 60L + seconds
}

/**
 * Calculation madhab for Asr time.
 */
enum class Madhab {
    SHAFI,
    HANAFI,
}

/**
 * Prayer calculation method.
 */
enum class CalculationMethodType(val displayName: String) {
    MUSLIM_WORLD_LEAGUE("Muslim World League"),
    EGYPTIAN("Egyptian General Authority"),
    KARACHI("University of Islamic Sciences, Karachi"),
    UMM_AL_QURA("Umm Al-Qura University, Makkah"),
    DUBAI("Dubai"),
    QATAR("Qatar"),
    KUWAIT("Kuwait"),
    MOON_SIGHTING("Moon Sighting Committee"),
    SINGAPORE("Singapore"),
    TURKEY("Turkey"),
    TEHRAN("Tehran"),
    NORTH_AMERICA("ISNA"),
}
