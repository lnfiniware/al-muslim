package com.almuslim.app.ui.screen.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.data.repository.SettingsRepository
import com.almuslim.app.domain.model.UserSettings
import com.almuslim.app.ui.theme.ThemeMode
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Settings ViewModel.
 *
 * Shared at the activity level so theme changes propagate globally (Bug #3 fix).
 * The theme-related flows are consumed by AlMuslimTheme in MainActivity,
 * ensuring all screens react to theme changes immediately.
 */
@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val settingsRepository: SettingsRepository,
) : ViewModel() {

    val settings: StateFlow<UserSettings> = settingsRepository.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), UserSettings())

    val themeMode: StateFlow<ThemeMode> = settingsRepository.themeMode
        .map { mode ->
            when (mode) {
                "light" -> ThemeMode.LIGHT
                "dark" -> ThemeMode.DARK
                else -> ThemeMode.SYSTEM
            }
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ThemeMode.SYSTEM)

    val isAmoled: StateFlow<Boolean> = settingsRepository.isAmoled
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    val onboardingComplete: StateFlow<Boolean> = settingsRepository.onboardingComplete
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    fun setThemeMode(mode: String) {
        viewModelScope.launch { settingsRepository.setThemeMode(mode) }
    }

    fun setAmoled(enabled: Boolean) {
        viewModelScope.launch { settingsRepository.setAmoled(enabled) }
    }

    fun setLanguage(lang: String) {
        viewModelScope.launch { settingsRepository.setLanguage(lang) }
    }

    fun setNotificationsEnabled(enabled: Boolean) {
        viewModelScope.launch { settingsRepository.setNotificationsEnabled(enabled) }
    }

    fun setMadhab(madhab: String) {
        viewModelScope.launch { settingsRepository.setMadhab(madhab) }
    }

    fun setUse24HourFormat(use24: Boolean) {
        viewModelScope.launch { settingsRepository.setUse24HourFormat(use24) }
    }

    fun setHapticsEnabled(enabled: Boolean) {
        viewModelScope.launch { settingsRepository.setHapticsEnabled(enabled) }
    }

    fun setKeepScreenAwake(enabled: Boolean) {
        viewModelScope.launch { settingsRepository.setKeepScreenAwake(enabled) }
    }

    fun setOnboardingComplete() {
        viewModelScope.launch { settingsRepository.setOnboardingComplete(true) }
    }
}
