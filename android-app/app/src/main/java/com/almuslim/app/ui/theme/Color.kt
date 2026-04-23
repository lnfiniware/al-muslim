package com.almuslim.app.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * Al-Muslim color palette.
 *
 * Primary Islamic green with gold accent, matching the design spec.
 * Colors are organized by role, not by visual similarity.
 */
object AlMuslimColors {
    // Primary — Deep Islamic Green
    val Primary = Color(0xFF0E7C66)
    val PrimaryLight = Color(0xFF2D9A7E)
    val PrimaryDark = Color(0xFF065C4B)
    val PrimaryContainer = Color(0xFFB8F0E0)
    val OnPrimaryContainer = Color(0xFF00201A)

    // Accent — Rich Gold
    val Accent = Color(0xFFD4AF37)
    val AccentLight = Color(0xFFE8C966)
    val AccentDark = Color(0xFFA68929)
    val AccentContainer = Color(0xFFFFF0C7)
    val OnAccentContainer = Color(0xFF261A00)

    // Surface — Light theme
    val Background = Color(0xFFF8FAFA)
    val Surface = Color(0xFFFFFFFF)
    val SurfaceVariant = Color(0xFFF1F5F3)
    val SurfaceContainer = Color(0xFFECF0EE)
    val SurfaceContainerHigh = Color(0xFFE6EAE8)

    // Surface — Dark theme
    val DarkBackground = Color(0xFF101010)
    val DarkSurface = Color(0xFF1E1E1E)
    val DarkSurfaceVariant = Color(0xFF2A2D2B)
    val DarkSurfaceContainer = Color(0xFF242826)
    val DarkSurfaceContainerHigh = Color(0xFF2E3230)

    // Surface — AMOLED
    val AmoledBackground = Color(0xFF000000)
    val AmoledSurface = Color(0xFF0A0A0A)
    val AmoledSurfaceVariant = Color(0xFF151515)

    // Text — Light
    val OnBackground = Color(0xFF1A1C1B)
    val OnSurface = Color(0xFF1A1C1B)
    val OnSurfaceVariant = Color(0xFF404943)

    // Text — Dark
    val DarkOnBackground = Color(0xFFE2E3E0)
    val DarkOnSurface = Color(0xFFE2E3E0)
    val DarkOnSurfaceVariant = Color(0xFFC0C9C1)

    // Status
    val Success = Color(0xFF4CAF50)
    val Warning = Color(0xFFFF9800)
    val Error = Color(0xFFF44336)
    val Info = Color(0xFF2196F3)

    // Outline
    val Outline = Color(0xFF717971)
    val OutlineVariant = Color(0xFFC0C9C1)
    val DarkOutline = Color(0xFF8B938B)
    val DarkOutlineVariant = Color(0xFF404943)

    // Quran reading specific
    val QuranBackground = Color(0xFF1A1A1A)
    val QuranVerseText = Color(0xFFE8E8E8)
    val QuranGoldAccent = Color(0xFFD4A574)
    val QuranCream = Color(0xFFF5EFE7)

    // Inverse
    val InverseSurface = Color(0xFF2E312F)
    val InverseOnSurface = Color(0xFFF0F1EE)
    val InversePrimary = Color(0xFF7CDBC0)
    val DarkInverseSurface = Color(0xFFE2E3E0)
    val DarkInverseOnSurface = Color(0xFF2E312F)
    val DarkInversePrimary = Color(0xFF0E7C66)
}
