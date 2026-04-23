package com.almuslim.app.service

import com.almuslim.app.domain.model.*
import com.batoulapps.adhan2.*
import com.batoulapps.adhan2.data.DateComponents
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Service for calculating Islamic prayer times.
 *
 * Uses the adhan2 library (batoulapps) — the de-facto standard for prayer
 * time calculations. Supports multiple calculation methods and madhabs.
 *
 * Ported from: src/services/prayerTimesService.ts
 */
@Singleton
class PrayerCalculationService @Inject constructor() {

    private val timeFormatter24 = DateTimeFormatter.ofPattern("HH:mm")
    private val timeFormatter12 = DateTimeFormatter.ofPattern("hh:mm a")

    /**
     * Calculate prayer times for a given date, location, and preferences.
     */
    fun getPrayerTimes(
        date: LocalDate,
        latitude: Double,
        longitude: Double,
        madhab: Madhab = Madhab.SHAFI,
        method: CalculationMethodType = CalculationMethodType.MUSLIM_WORLD_LEAGUE,
        use24Hour: Boolean = true,
    ): DailyPrayers {
        val coordinates = Coordinates(latitude, longitude)
        val params = getCalculationParameters(method).apply {
            this.madhab = when (madhab) {
                Madhab.HANAFI -> com.batoulapps.adhan2.Madhab.HANAFI
                Madhab.SHAFI -> com.batoulapps.adhan2.Madhab.SHAFI
            }
        }

        val dateComponents = DateComponents(date.year, date.monthValue, date.dayOfMonth)
        val prayerTimes = PrayerTimes(coordinates, dateComponents, params)
        val formatter = if (use24Hour) timeFormatter24 else timeFormatter12
        val zone = ZoneId.systemDefault()

        fun toLocalDateTime(instant: kotlinx.datetime.Instant): LocalDateTime {
            val javaInstant = java.time.Instant.ofEpochSecond(instant.epochSeconds)
            return LocalDateTime.ofInstant(javaInstant, zone)
        }

        fun formatTime(instant: kotlinx.datetime.Instant): String {
            return toLocalDateTime(instant).format(formatter)
        }

        return DailyPrayers(
            fajr = PrayerTime(PrayerName.FAJR, toLocalDateTime(prayerTimes.fajr), formatTime(prayerTimes.fajr)),
            sunrise = PrayerTime(PrayerName.SUNRISE, toLocalDateTime(prayerTimes.sunrise), formatTime(prayerTimes.sunrise)),
            dhuhr = PrayerTime(PrayerName.DHUHR, toLocalDateTime(prayerTimes.dhuhr), formatTime(prayerTimes.dhuhr)),
            asr = PrayerTime(PrayerName.ASR, toLocalDateTime(prayerTimes.asr), formatTime(prayerTimes.asr)),
            maghrib = PrayerTime(PrayerName.MAGHRIB, toLocalDateTime(prayerTimes.maghrib), formatTime(prayerTimes.maghrib)),
            isha = PrayerTime(PrayerName.ISHA, toLocalDateTime(prayerTimes.isha), formatTime(prayerTimes.isha)),
            date = date,
        )
    }

    /**
     * Get the next prayer from a daily prayer set.
     */
    fun getNextPrayer(dailyPrayers: DailyPrayers, now: LocalDateTime = LocalDateTime.now()): PrayerTime? {
        return dailyPrayers.obligatoryPrayers().firstOrNull { it.time.isAfter(now) }
    }

    /**
     * Get the currently active prayer (the last one that started).
     */
    fun getCurrentPrayer(dailyPrayers: DailyPrayers, now: LocalDateTime = LocalDateTime.now()): PrayerTime? {
        val prayers = dailyPrayers.obligatoryPrayers()
        for (i in prayers.indices) {
            val current = prayers[i]
            val next = prayers.getOrNull(i + 1)
            if (now >= current.time && (next == null || now < next.time)) {
                return current
            }
        }
        return null
    }

    /**
     * Calculate time remaining until a target prayer.
     */
    fun calculateTimeUntil(targetTime: LocalDateTime, from: LocalDateTime = LocalDateTime.now()): PrayerCountdown {
        val duration = java.time.Duration.between(from, targetTime)
        if (duration.isNegative) return PrayerCountdown(0, 0, 0)

        val totalSeconds = duration.seconds
        val hours = (totalSeconds / 3600).toInt()
        val minutes = ((totalSeconds % 3600) / 60).toInt()
        val seconds = (totalSeconds % 60).toInt()
        return PrayerCountdown(hours, minutes, seconds)
    }

    private fun getCalculationParameters(method: CalculationMethodType): CalculationParameters {
        return when (method) {
            CalculationMethodType.MUSLIM_WORLD_LEAGUE -> CalculationMethod.MUSLIM_WORLD_LEAGUE.parameters
            CalculationMethodType.EGYPTIAN -> CalculationMethod.EGYPTIAN.parameters
            CalculationMethodType.KARACHI -> CalculationMethod.KARACHI.parameters
            CalculationMethodType.UMM_AL_QURA -> CalculationMethod.UMM_AL_QURA.parameters
            CalculationMethodType.DUBAI -> CalculationMethod.DUBAI.parameters
            CalculationMethodType.QATAR -> CalculationMethod.QATAR.parameters
            CalculationMethodType.KUWAIT -> CalculationMethod.KUWAIT.parameters
            CalculationMethodType.MOON_SIGHTING -> CalculationMethod.MOON_SIGHTING_COMMITTEE.parameters
            CalculationMethodType.SINGAPORE -> CalculationMethod.SINGAPORE.parameters
            CalculationMethodType.TURKEY -> CalculationMethod.TURKEY.parameters
            CalculationMethodType.TEHRAN -> CalculationMethod.TEHRAN.parameters
            CalculationMethodType.NORTH_AMERICA -> CalculationMethod.NORTH_AMERICA.parameters
        }
    }
}
