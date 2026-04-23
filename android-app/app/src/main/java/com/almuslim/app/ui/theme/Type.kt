package com.almuslim.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
// import com.almuslim.app.R  // Uncomment when font files are added

/**
 * Font families used throughout the app.
 *
 * Inter -- Primary UI font for Latin text (clean, modern).
 * Amiri -- Quranic Arabic rendering with full Unicode coverage (Bug #11 fix).
 * NotoNaskhArabic -- Arabic UI text (settings, labels, navigation).
 *
 * SETUP: To use custom fonts, place .ttf files in res/font/ and uncomment
 * the Font() declarations below. Until then, system defaults are used.
 *
 * Required font files:
 *   res/font/inter_regular.ttf
 *   res/font/inter_medium.ttf
 *   res/font/inter_semibold.ttf
 *   res/font/inter_bold.ttf
 *   res/font/inter_extrabold.ttf
 *   res/font/amiri_regular.ttf
 *   res/font/amiri_bold.ttf
 *   res/font/noto_naskh_arabic_regular.ttf
 *   res/font/noto_naskh_arabic_medium.ttf
 *   res/font/noto_naskh_arabic_bold.ttf
 */

// TODO: Uncomment after adding font files to res/font/
// val InterFontFamily = FontFamily(
//     Font(R.font.inter_regular, FontWeight.Normal),
//     Font(R.font.inter_medium, FontWeight.Medium),
//     Font(R.font.inter_semibold, FontWeight.SemiBold),
//     Font(R.font.inter_bold, FontWeight.Bold),
//     Font(R.font.inter_extrabold, FontWeight.ExtraBold),
// )
val InterFontFamily = FontFamily.Default

// TODO: Uncomment after adding font files to res/font/
// val AmiriFontFamily = FontFamily(
//     Font(R.font.amiri_regular, FontWeight.Normal),
//     Font(R.font.amiri_bold, FontWeight.Bold),
// )
val AmiriFontFamily = FontFamily.Default

// TODO: Uncomment after adding font files to res/font/
// val NotoNaskhArabicFontFamily = FontFamily(
//     Font(R.font.noto_naskh_arabic_regular, FontWeight.Normal),
//     Font(R.font.noto_naskh_arabic_medium, FontWeight.Medium),
//     Font(R.font.noto_naskh_arabic_bold, FontWeight.Bold),
// )
val NotoNaskhArabicFontFamily = FontFamily.Default

/**
 * Material 3 Typography scale for Al-Muslim.
 *
 * Uses Inter for display/headline/body text, ensuring clean modern UI.
 * Arabic text should use AmiriFontFamily or NotoNaskhArabicFontFamily
 * via Text(fontFamily = ...) overrides on individual composables.
 */
val AlMuslimTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 57.sp,
        lineHeight = 64.sp,
        letterSpacing = (-0.25).sp,
    ),
    displayMedium = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 45.sp,
        lineHeight = 52.sp,
    ),
    displaySmall = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 36.sp,
        lineHeight = 44.sp,
    ),
    headlineLarge = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 40.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 32.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.15.sp,
    ),
    titleSmall = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.25.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.4.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp,
    ),
    labelMedium = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp,
    ),
)
