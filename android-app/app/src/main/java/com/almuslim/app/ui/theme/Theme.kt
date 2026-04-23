package com.almuslim.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.platform.LocalContext

/**
 * Theme mode as stored in user preferences.
 */
enum class ThemeMode {
    LIGHT, DARK, SYSTEM
}

/**
 * Extended colors that Material 3 doesn't provide natively.
 * These are accessible via LocalExtendedColors.
 */
data class ExtendedColors(
    val accent: androidx.compose.ui.graphics.Color,
    val accentContainer: androidx.compose.ui.graphics.Color,
    val onAccentContainer: androidx.compose.ui.graphics.Color,
    val success: androidx.compose.ui.graphics.Color,
    val warning: androidx.compose.ui.graphics.Color,
    val info: androidx.compose.ui.graphics.Color,
    val quranBackground: androidx.compose.ui.graphics.Color,
    val quranVerseText: androidx.compose.ui.graphics.Color,
    val quranGoldAccent: androidx.compose.ui.graphics.Color,
)

val LocalExtendedColors = staticCompositionLocalOf {
    ExtendedColors(
        accent = AlMuslimColors.Accent,
        accentContainer = AlMuslimColors.AccentContainer,
        onAccentContainer = AlMuslimColors.OnAccentContainer,
        success = AlMuslimColors.Success,
        warning = AlMuslimColors.Warning,
        info = AlMuslimColors.Info,
        quranBackground = AlMuslimColors.QuranBackground,
        quranVerseText = AlMuslimColors.QuranVerseText,
        quranGoldAccent = AlMuslimColors.QuranGoldAccent,
    )
}

private val LightColorScheme = lightColorScheme(
    primary = AlMuslimColors.Primary,
    onPrimary = androidx.compose.ui.graphics.Color.White,
    primaryContainer = AlMuslimColors.PrimaryContainer,
    onPrimaryContainer = AlMuslimColors.OnPrimaryContainer,
    secondary = AlMuslimColors.Accent,
    onSecondary = androidx.compose.ui.graphics.Color.White,
    secondaryContainer = AlMuslimColors.AccentContainer,
    onSecondaryContainer = AlMuslimColors.OnAccentContainer,
    tertiary = AlMuslimColors.AccentLight,
    background = AlMuslimColors.Background,
    onBackground = AlMuslimColors.OnBackground,
    surface = AlMuslimColors.Surface,
    onSurface = AlMuslimColors.OnSurface,
    surfaceVariant = AlMuslimColors.SurfaceVariant,
    onSurfaceVariant = AlMuslimColors.OnSurfaceVariant,
    surfaceContainer = AlMuslimColors.SurfaceContainer,
    surfaceContainerHigh = AlMuslimColors.SurfaceContainerHigh,
    outline = AlMuslimColors.Outline,
    outlineVariant = AlMuslimColors.OutlineVariant,
    error = AlMuslimColors.Error,
    inverseSurface = AlMuslimColors.InverseSurface,
    inverseOnSurface = AlMuslimColors.InverseOnSurface,
    inversePrimary = AlMuslimColors.InversePrimary,
)

private val DarkColorScheme = darkColorScheme(
    primary = AlMuslimColors.PrimaryLight,
    onPrimary = AlMuslimColors.PrimaryDark,
    primaryContainer = AlMuslimColors.Primary,
    onPrimaryContainer = AlMuslimColors.PrimaryContainer,
    secondary = AlMuslimColors.AccentLight,
    onSecondary = AlMuslimColors.AccentDark,
    secondaryContainer = AlMuslimColors.Accent,
    onSecondaryContainer = AlMuslimColors.AccentContainer,
    tertiary = AlMuslimColors.Accent,
    background = AlMuslimColors.DarkBackground,
    onBackground = AlMuslimColors.DarkOnBackground,
    surface = AlMuslimColors.DarkSurface,
    onSurface = AlMuslimColors.DarkOnSurface,
    surfaceVariant = AlMuslimColors.DarkSurfaceVariant,
    onSurfaceVariant = AlMuslimColors.DarkOnSurfaceVariant,
    surfaceContainer = AlMuslimColors.DarkSurfaceContainer,
    surfaceContainerHigh = AlMuslimColors.DarkSurfaceContainerHigh,
    outline = AlMuslimColors.DarkOutline,
    outlineVariant = AlMuslimColors.DarkOutlineVariant,
    error = AlMuslimColors.Error,
    inverseSurface = AlMuslimColors.DarkInverseSurface,
    inverseOnSurface = AlMuslimColors.DarkInverseOnSurface,
    inversePrimary = AlMuslimColors.DarkInversePrimary,
)

private val AmoledColorScheme = DarkColorScheme.copy(
    background = AlMuslimColors.AmoledBackground,
    surface = AlMuslimColors.AmoledSurface,
    surfaceVariant = AlMuslimColors.AmoledSurfaceVariant,
    surfaceContainer = AlMuslimColors.AmoledSurface,
    surfaceContainerHigh = AlMuslimColors.AmoledSurfaceVariant,
)

private val LightExtendedColors = ExtendedColors(
    accent = AlMuslimColors.Accent,
    accentContainer = AlMuslimColors.AccentContainer,
    onAccentContainer = AlMuslimColors.OnAccentContainer,
    success = AlMuslimColors.Success,
    warning = AlMuslimColors.Warning,
    info = AlMuslimColors.Info,
    quranBackground = AlMuslimColors.QuranCream,
    quranVerseText = AlMuslimColors.OnSurface,
    quranGoldAccent = AlMuslimColors.QuranGoldAccent,
)

private val DarkExtendedColors = ExtendedColors(
    accent = AlMuslimColors.AccentLight,
    accentContainer = AlMuslimColors.AccentDark,
    onAccentContainer = AlMuslimColors.AccentContainer,
    success = AlMuslimColors.Success,
    warning = AlMuslimColors.Warning,
    info = AlMuslimColors.Info,
    quranBackground = AlMuslimColors.QuranBackground,
    quranVerseText = AlMuslimColors.QuranVerseText,
    quranGoldAccent = AlMuslimColors.QuranGoldAccent,
)

/**
 * Al-Muslim app theme.
 *
 * Wraps Material 3 with custom color tokens and extended colors.
 * Theme state flows reactively from SettingsViewModel, fixing Bug #3
 * where theme changes in Settings didn't propagate to other screens.
 *
 * @param themeMode Light, Dark, or System
 * @param isAmoled Whether to use pure black AMOLED backgrounds
 * @param useDynamicColors Whether to use Material You dynamic colors on Android 12+
 */
@Composable
fun AlMuslimTheme(
    themeMode: ThemeMode = ThemeMode.SYSTEM,
    isAmoled: Boolean = false,
    useDynamicColors: Boolean = false,
    content: @Composable () -> Unit,
) {
    val isDarkTheme = when (themeMode) {
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
    }

    val colorScheme: ColorScheme
    val extendedColors: ExtendedColors

    when {
        useDynamicColors && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            colorScheme = if (isDarkTheme) {
                if (isAmoled) {
                    dynamicDarkColorScheme(context).copy(
                        background = AlMuslimColors.AmoledBackground,
                        surface = AlMuslimColors.AmoledSurface,
                    )
                } else {
                    dynamicDarkColorScheme(context)
                }
            } else {
                dynamicLightColorScheme(context)
            }
            extendedColors = if (isDarkTheme) DarkExtendedColors else LightExtendedColors
        }
        isDarkTheme && isAmoled -> {
            colorScheme = AmoledColorScheme
            extendedColors = DarkExtendedColors
        }
        isDarkTheme -> {
            colorScheme = DarkColorScheme
            extendedColors = DarkExtendedColors
        }
        else -> {
            colorScheme = LightColorScheme
            extendedColors = LightExtendedColors
        }
    }

    CompositionLocalProvider(
        LocalExtendedColors provides extendedColors,
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = AlMuslimTypography,
            shapes = AlMuslimShapes,
            content = content,
        )
    }
}
