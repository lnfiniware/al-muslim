package com.almuslim.app.ui.screen.adhkar

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.data.repository.AdhkarRepository
import com.almuslim.app.domain.model.Adhkar
import com.almuslim.app.domain.model.AdhkarCategory
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AdhkarUiState(
    val selectedCategory: AdhkarCategory = AdhkarCategory.MORNING,
    val adhkarList: List<Adhkar> = emptyList(),
    val progress: Map<String, Int> = emptyMap(),
    val isLoading: Boolean = true,
)

@HiltViewModel
class AdhkarViewModel @Inject constructor(
    private val repository: AdhkarRepository,
) : ViewModel() {
    private val _category = MutableStateFlow(AdhkarCategory.MORNING)
    private val _progress = repository.getAllProgress()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyMap())

    val uiState: StateFlow<AdhkarUiState> = combine(_category, _progress) { cat, prog -> cat to prog }
        .flatMapLatest { (cat, prog) ->
            repository.getAdhkarByCategory(cat).map { list ->
                AdhkarUiState(selectedCategory = cat, adhkarList = list, progress = prog, isLoading = false)
            }
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AdhkarUiState())

    fun selectCategory(category: AdhkarCategory) { _category.value = category }

    fun increment(adhkar: Adhkar) {
        val current = _progress.value[adhkar.id] ?: 0
        if (current < adhkar.count) {
            viewModelScope.launch { repository.updateProgress(adhkar.id, current + 1) }
        }
    }

    fun reset(adhkarId: String) {
        viewModelScope.launch { repository.resetProgress(adhkarId) }
    }
}
