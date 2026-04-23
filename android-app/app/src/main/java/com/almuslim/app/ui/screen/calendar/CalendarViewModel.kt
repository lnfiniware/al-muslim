package com.almuslim.app.ui.screen.calendar

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.domain.model.HijriDate
import com.almuslim.app.service.HijriConversionService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

data class CalendarDay(val gregorian: LocalDate, val hijri: HijriDate, val isToday: Boolean)
data class CalendarUiState(val days: List<CalendarDay> = emptyList(), val todayGregorian: String = "", val todayHijri: String = "")

@HiltViewModel
class CalendarViewModel @Inject constructor(
    private val hijriService: HijriConversionService,
) : ViewModel() {
    val state: StateFlow<CalendarUiState> = flow {
        val today = LocalDate.now()
        val fmt = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy")
        val days = (0 until 30).map { i ->
            val date = today.plusDays(i.toLong())
            CalendarDay(date, hijriService.gregorianToHijri(date), date == today)
        }
        emit(CalendarUiState(days, today.format(fmt), hijriService.getFormattedHijriDate(today)))
    }.stateIn(viewModelScope, SharingStarted.Lazily, CalendarUiState())
}
