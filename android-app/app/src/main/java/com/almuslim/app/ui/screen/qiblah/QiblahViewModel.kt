package com.almuslim.app.ui.screen.qiblah

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.domain.model.LocationData
import com.almuslim.app.domain.model.QiblahDirection
import com.almuslim.app.service.LocationService
import com.almuslim.app.service.QiblahCalculationService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class QiblahUiState(
    val isLoading: Boolean = true,
    val qiblah: QiblahDirection? = null,
    val location: LocationData? = null,
)

@HiltViewModel
class QiblahViewModel @Inject constructor(
    private val locationService: LocationService,
    private val qiblahService: QiblahCalculationService,
) : ViewModel() {
    private val _state = MutableStateFlow(QiblahUiState())
    val state: StateFlow<QiblahUiState> = _state.asStateFlow()

    init { loadQiblah() }

    private fun loadQiblah() {
        viewModelScope.launch {
            val loc = locationService.getCurrentLocation() ?: return@launch
            val qiblah = qiblahService.calculateQiblah(loc.latitude, loc.longitude)
            _state.update { QiblahUiState(isLoading = false, qiblah = qiblah, location = loc) }
        }
    }
}
