package com.almuslim.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.hilt.navigation.compose.hiltViewModel
import com.almuslim.app.ui.navigation.AlMuslimNavHost
import com.almuslim.app.ui.screen.settings.SettingsViewModel
import com.almuslim.app.ui.theme.AlMuslimTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Single-activity architecture host.
 *
 * All screens are Compose destinations managed by Navigation Compose.
 * Theme is reactive — changes in Settings propagate globally (Bug #3 fix).
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        setContent {
            val settingsViewModel: SettingsViewModel = hiltViewModel()
            val themeMode by settingsViewModel.themeMode.collectAsState()
            val isAmoled by settingsViewModel.isAmoled.collectAsState()

            AlMuslimTheme(
                themeMode = themeMode,
                isAmoled = isAmoled,
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                ) {
                    AlMuslimNavHost(settingsViewModel = settingsViewModel)
                }
            }
        }
    }
}
