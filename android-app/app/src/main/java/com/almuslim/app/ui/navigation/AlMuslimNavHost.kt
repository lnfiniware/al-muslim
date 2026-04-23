package com.almuslim.app.ui.navigation

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.almuslim.app.ui.screen.adhkar.AdhkarScreen
import com.almuslim.app.ui.screen.calendar.CalendarScreen
import com.almuslim.app.ui.screen.home.HomeScreen
import com.almuslim.app.ui.screen.onboarding.OnboardingScreen
import com.almuslim.app.ui.screen.prayer.PrayerScreen
import com.almuslim.app.ui.screen.qiblah.QiblahScreen
import com.almuslim.app.ui.screen.quran.QuranListScreen
import com.almuslim.app.ui.screen.quran.QuranReaderScreen
import com.almuslim.app.ui.screen.settings.SettingsScreen
import com.almuslim.app.ui.screen.settings.SettingsViewModel

/**
 * Main navigation host.
 *
 * Uses bottom navigation for primary tabs and standard navigation
 * for detail screens (Quran reader, Qiblah, Calendar).
 */
@Composable
fun AlMuslimNavHost(
    settingsViewModel: SettingsViewModel,
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    val onboardingComplete by settingsViewModel.onboardingComplete.collectAsState()

    val startDestination = if (onboardingComplete) Screen.Home.route else Screen.Onboarding.route

    // Determine if bottom bar should be visible
    val showBottomBar = Screen.bottomNavItems.any { screen ->
        currentDestination?.hierarchy?.any { it.route == screen.route } == true
    }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomNavBar(
                    items = Screen.bottomNavItems,
                    currentDestination = currentDestination,
                    onItemClick = { screen ->
                        navController.navigate(screen.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                )
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.padding(innerPadding),
            enterTransition = { fadeIn(animationSpec = tween(200)) },
            exitTransition = { fadeOut(animationSpec = tween(200)) },
        ) {
            composable(Screen.Onboarding.route) {
                OnboardingScreen(
                    onComplete = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Onboarding.route) { inclusive = true }
                        }
                    },
                )
            }

            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToQiblah = { navController.navigate(Screen.Qiblah.route) },
                    onNavigateToCalendar = { navController.navigate(Screen.Calendar.route) },
                )
            }

            composable(Screen.Prayer.route) {
                PrayerScreen()
            }

            composable(Screen.Quran.route) {
                QuranListScreen(
                    onSurahClick = { surahNumber ->
                        navController.navigate(Screen.QuranReader.createRoute(surahNumber))
                    },
                )
            }

            composable(
                route = Screen.QuranReader.route,
                arguments = listOf(navArgument("surahNumber") { type = NavType.IntType }),
            ) { backStackEntry ->
                val surahNumber = backStackEntry.arguments?.getInt("surahNumber") ?: 1
                QuranReaderScreen(
                    surahNumber = surahNumber,
                    onBack = { navController.popBackStack() },
                    onNavigateToSurah = { number ->
                        navController.navigate(Screen.QuranReader.createRoute(number)) {
                            popUpTo(Screen.Quran.route)
                        }
                    },
                )
            }

            composable(Screen.Adhkar.route) {
                AdhkarScreen()
            }

            composable(Screen.Settings.route) {
                SettingsScreen(settingsViewModel = settingsViewModel)
            }

            composable(Screen.Qiblah.route) {
                QiblahScreen(onBack = { navController.popBackStack() })
            }

            composable(Screen.Calendar.route) {
                CalendarScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}
