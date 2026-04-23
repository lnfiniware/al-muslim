package com.almuslim.app.ui.screen.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.data.repository.SettingsRepository
import com.almuslim.app.domain.model.*
import com.almuslim.app.service.HijriConversionService
import com.almuslim.app.service.LocationService
import com.almuslim.app.service.PrayerCalculationService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalDateTime
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = true,
    val location: LocationData? = null,
    val dailyPrayers: DailyPrayers? = null,
    val nextPrayer: PrayerTime? = null,
    val currentPrayer: PrayerTime? = null,
    val countdown: PrayerCountdown = PrayerCountdown(0, 0, 0),
    val hijriDate: HijriDate? = null,
    val error: String? = null,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val locationService: LocationService,
    private val prayerService: PrayerCalculationService,
    private val hijriService: HijriConversionService,
    private val settingsRepository: SettingsRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadData()
        startCountdownTimer()
    }

    fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val location = locationService.getCurrentLocation()
                if (location == null) {
                    _uiState.update { it.copy(isLoading = false, error = "Location access required for prayer times") }
                    return@launch
                }

                val settings = settingsRepository.settings.first()
                val madhab = if (settings.madhab == "HANAFI") Madhab.HANAFI else Madhab.SHAFI
                val use24Hour = settings.use24HourFormat

                val dailyPrayers = prayerService.getPrayerTimes(
                    date = LocalDate.now(),
                    latitude = location.latitude,
                    longitude = location.longitude,
                    madhab = madhab,
                    use24Hour = use24Hour,
                )

                val now = LocalDateTime.now()
                val nextPrayer = prayerService.getNextPrayer(dailyPrayers, now)
                val currentPrayer = prayerService.getCurrentPrayer(dailyPrayers, now)
                val countdown = nextPrayer?.let { prayerService.calculateTimeUntil(it.time, now) }
                    ?: PrayerCountdown(0, 0, 0)
                val hijriDate = hijriService.gregorianToHijri()

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        location = location,
                        dailyPrayers = dailyPrayers,
                        nextPrayer = nextPrayer,
                        currentPrayer = currentPrayer,
                        countdown = countdown,
                        hijriDate = hijriDate,
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message ?: "Failed to load prayer times") }
            }
        }
    }

    private fun startCountdownTimer() {
        viewModelScope.launch {
            while (true) {
                delay(1000)
                val state = _uiState.value
                val nextPrayer = state.nextPrayer ?: continue
                val countdown = prayerService.calculateTimeUntil(nextPrayer.time)

                if (countdown.totalSeconds <= 0) {
                    // Prayer time reached, refresh data
                    loadData()
                } else {
                    _uiState.update { it.copy(countdown = countdown) }
                }
            }
        }
    }

    fun refresh() {
        locationService.clearCache()
        loadData()
    }
}
