package com.almuslim.app.ui.screen.quran

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.almuslim.app.data.repository.QuranRepository
import com.almuslim.app.domain.model.Ayah
import com.almuslim.app.domain.model.Surah
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class QuranListUiState(
    val surahs: List<Surah> = emptyList(),
    val isLoading: Boolean = true,
)

data class QuranReaderUiState(
    val surah: Surah? = null,
    val ayahs: List<Ayah> = emptyList(),
    val isLoading: Boolean = true,
    val isBookmarked: Map<Int, Boolean> = emptyMap(),
)

@HiltViewModel
class QuranViewModel @Inject constructor(
    private val quranRepository: QuranRepository,
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    val surahListState: StateFlow<QuranListUiState> = _searchQuery
        .flatMapLatest { query ->
            if (query.isBlank()) {
                quranRepository.getAllSurahs()
            } else {
                quranRepository.searchSurahs(query)
            }
        }
        .map { surahs -> QuranListUiState(surahs = surahs, isLoading = false) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), QuranListUiState())

    private val _readerState = MutableStateFlow(QuranReaderUiState())
    val readerState: StateFlow<QuranReaderUiState> = _readerState.asStateFlow()

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun loadSurah(surahNumber: Int) {
        viewModelScope.launch {
            _readerState.update { it.copy(isLoading = true) }
            val surah = quranRepository.getSurah(surahNumber)
            quranRepository.getAyahsBySurah(surahNumber).collect { ayahs ->
                _readerState.update {
                    it.copy(surah = surah, ayahs = ayahs, isLoading = false)
                }
            }
        }
    }

    fun addBookmark(surahNumber: Int, ayahNumber: Int, surahName: String) {
        viewModelScope.launch {
            quranRepository.addBookmark(surahNumber, ayahNumber, surahName)
        }
    }

    fun removeBookmark(surahNumber: Int, ayahNumber: Int) {
        viewModelScope.launch {
            quranRepository.removeBookmark(surahNumber, ayahNumber)
        }
    }
}
