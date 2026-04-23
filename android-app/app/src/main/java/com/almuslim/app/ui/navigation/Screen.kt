package com.almuslim.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * All navigation destinations in the app.
 */
sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector? = null,
    val unselectedIcon: ImageVector? = null,
) {
    // Bottom navigation tabs
    data object Home : Screen("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    data object Prayer : Screen("prayer", "Prayer", Icons.Filled.AccessTime, Icons.Outlined.AccessTime)
    data object Quran : Screen("quran", "Quran", Icons.Filled.MenuBook, Icons.Outlined.MenuBook)
    data object Adhkar : Screen("adhkar", "Adhkar", Icons.Filled.FavoriteBorder, Icons.Outlined.FavoriteBorder)
    data object Settings : Screen("settings", "Settings", Icons.Filled.Settings, Icons.Outlined.Settings)

    // Detail screens (not in bottom nav)
    data object QuranReader : Screen("quran/{surahNumber}", "Quran Reader") {
        fun createRoute(surahNumber: Int) = "quran/$surahNumber"
    }
    data object Qiblah : Screen("qiblah", "Qiblah")
    data object Calendar : Screen("calendar", "Calendar")
    data object Onboarding : Screen("onboarding", "Onboarding")

    companion object {
        val bottomNavItems = listOf(Home, Prayer, Quran, Adhkar, Settings)
    }
}
