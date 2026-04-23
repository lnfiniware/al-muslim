package com.almuslim.app.service

import com.almuslim.app.domain.model.QiblahDirection
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.*

/**
 * Qiblah (direction to Kaaba in Mecca) calculation service.
 *
 * Uses the great-circle bearing formula to calculate the initial bearing
 * from the user's location to the Kaaba.
 *
 * Ported from: src/services/qiblahService.ts
 */
@Singleton
class QiblahCalculationService @Inject constructor() {

    companion object {
        // Coordinates of the Kaaba in Mecca
        private const val MECCA_LAT = 21.4225
        private const val MECCA_LNG = 39.8262
    }

    /**
     * Calculate the Qiblah direction from the given coordinates.
     *
     * @param latitude User's latitude in degrees
     * @param longitude User's longitude in degrees
     * @return QiblahDirection with angle (0-360° from North) and compass direction string
     */
    fun calculateQiblah(latitude: Double, longitude: Double): QiblahDirection {
        val lat1 = Math.toRadians(latitude)
        val lon1 = Math.toRadians(longitude)
        val lat2 = Math.toRadians(MECCA_LAT)
        val lon2 = Math.toRadians(MECCA_LNG)

        val dLon = lon2 - lon1

        val y = sin(dLon) * cos(lat2)
        val x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon)

        var angle = Math.toDegrees(atan2(y, x))
        angle = (angle + 360) % 360 // Normalize to 0-360

        return QiblahDirection(
            angle = (angle * 10).roundToInt() / 10.0,
            direction = getCompassDirection(angle),
        )
    }

    /**
     * Convert an angle to a 16-point compass direction string.
     */
    fun getCompassDirection(angle: Double): String {
        val directions = arrayOf(
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        )
        val index = ((angle / 22.5).roundToInt()) % 16
        return directions[index]
    }

    /**
     * Format angle for display.
     */
    fun formatAngle(angle: Double): String = "${angle}°"

    /**
     * Get a Unicode arrow character for a compass direction.
     */
    fun getDirectionArrow(direction: String): String = when (direction) {
        "N", "NNW" -> "\u2191"   // ↑
        "NNE", "NE" -> "\u2197"  // ↗
        "ENE", "E" -> "\u2192"   // →
        "ESE", "SE" -> "\u2198"  // ↘
        "SSE", "S" -> "\u2193"   // ↓
        "SSW", "SW" -> "\u2199"  // ↙
        "WSW", "W" -> "\u2190"   // ←
        "WNW", "NW" -> "\u2196"  // ↖
        else -> "\u2192"          // →
    }
}

private fun Double.roundToInt(): Int = kotlin.math.round(this).toInt()
