package com.almuslim.app.service

import com.almuslim.app.domain.model.HijriDate
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.floor

/**
 * Hijri (Islamic) calendar conversion service.
 *
 * Converts Gregorian dates to Hijri calendar dates using the Kuwaiti algorithm.
 *
 * Ported from: src/services/hijriService.ts
 */
@Singleton
class HijriConversionService @Inject constructor() {

    companion object {
        val MONTHS_EN = arrayOf(
            "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
            "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
            "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
        )

        val MONTHS_AR = arrayOf(
            "\u0645\u062D\u0631\u0645", "\u0635\u0641\u0631",
            "\u0631\u0628\u064A\u0639 \u0627\u0644\u0623\u0648\u0644", "\u0631\u0628\u064A\u0639 \u0627\u0644\u062B\u0627\u0646\u064A",
            "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0623\u0648\u0644\u0649", "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u062B\u0627\u0646\u064A\u0629",
            "\u0631\u062C\u0628", "\u0634\u0639\u0628\u0627\u0646",
            "\u0631\u0645\u0636\u0627\u0646", "\u0634\u0648\u0627\u0644",
            "\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629", "\u0630\u0648 \u0627\u0644\u062D\u062C\u0629",
        )
    }

    /**
     * Convert a Gregorian date to a Hijri date using the Kuwaiti algorithm.
     */
    fun gregorianToHijri(date: LocalDate = LocalDate.now()): HijriDate {
        val year = date.year
        val month = date.monthValue
        val day = date.dayOfMonth

        val n = day +
            floor(30.6001 * (month + 1)).toInt() -
            floor(30.6001 * 1.0).toInt() +
            365 * (year - 1) +
            floor((year - 1) / 4.0).toInt() -
            floor((year - 1) / 100.0).toInt() +
            floor((year - 1) / 400.0).toInt() - 79

        val q = n / 10631
        val r = n % 10631

        val a = r / 354
        val w = r % 354

        val q2 = w / 30

        var hijriYear = 30 * q + 11 * a + q2 + 1
        var hijriMonth = ((w % 30) + 15) / 30 + 1
        val hijriDay = ((w % 30) + 15) % 30 + 1

        if (hijriMonth > 12) {
            hijriMonth = 1
            hijriYear++
        }

        return HijriDate(
            year = hijriYear,
            month = hijriMonth,
            day = hijriDay,
            monthName = MONTHS_EN.getOrElse(hijriMonth - 1) { "Unknown" },
            monthNameArabic = MONTHS_AR.getOrElse(hijriMonth - 1) { "" },
        )
    }

    /**
     * Get a formatted Hijri date string.
     */
    fun getFormattedHijriDate(date: LocalDate = LocalDate.now(), arabic: Boolean = false): String {
        return gregorianToHijri(date).formatted(arabic)
    }

    /**
     * Check if the current Hijri month is Ramadan (month 9).
     */
    fun isRamadan(date: LocalDate = LocalDate.now()): Boolean {
        return gregorianToHijri(date).month == 9
    }

    /**
     * Get remaining days in Ramadan, or -1 if not currently Ramadan.
     */
    fun getDaysRemainingInRamadan(date: LocalDate = LocalDate.now()): Int {
        val hijri = gregorianToHijri(date)
        return if (hijri.month == 9) 30 - hijri.day else -1
    }
}
