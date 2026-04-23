package com.almuslim.app.ui.screen.prayer

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.data.repository.SettingsRepository
import com.almuslim.app.domain.model.*
import com.almuslim.app.service.LocationService
import com.almuslim.app.service.PrayerCalculationService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

data class PrayerDayItem(val dateLabel: String, val prayers: List<PrayerTime>)
data class PrayerScreenState(val days: List<PrayerDayItem> = emptyList(), val isLoading: Boolean = true)

@HiltViewModel
class PrayerViewModel @Inject constructor(
    private val locationService: LocationService,
    private val prayerService: PrayerCalculationService,
    private val settingsRepository: SettingsRepository,
) : ViewModel() {
    private val _state = MutableStateFlow(PrayerScreenState())
    val state: StateFlow<PrayerScreenState> = _state.asStateFlow()

    init { loadPrayerTimes() }

    fun loadPrayerTimes() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            val loc = locationService.getCurrentLocation() ?: return@launch
            val settings = settingsRepository.settings.first()
            val madhab = if (settings.madhab == "HANAFI") Madhab.HANAFI else Madhab.SHAFI
            val fmt = DateTimeFormatter.ofPattern("EEE, MMM d")
            val days = (0 until 30).map { i ->
                val date = LocalDate.now().plusDays(i.toLong())
                val prayers = prayerService.getPrayerTimes(date, loc.latitude, loc.longitude, madhab, use24Hour = settings.use24HourFormat)
                PrayerDayItem(dateLabel = date.format(fmt), prayers = prayers.toList())
            }
            _state.update { PrayerScreenState(days = days, isLoading = false) }
        }
    }
}
