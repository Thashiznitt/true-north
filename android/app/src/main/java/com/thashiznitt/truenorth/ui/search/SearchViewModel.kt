package com.thashiznitt.truenorth.ui.search

import android.content.Context
import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.data.repository.ScriptureRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class SearchUiState(
    val query: String = "",
    val results: List<VerseItem> = emptyList(),
    val bookmarkedRefs: Set<String> = emptySet(),
    val isSearching: Boolean = false,
    val suggestedTopics: List<String> = listOf("Peace", "Love", "Light", "Faith", "Strength", "Grace", "Hope")
)

class SearchViewModel(
    private val scriptureRepository: ScriptureRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(SearchUiState())
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()

    private var searchJob: Job? = null

    init {
        observeBookmarks()
    }

    private fun observeBookmarks() {
        viewModelScope.launch {
            scriptureRepository.getAllBookmarks().collect { list ->
                val refs = list.map { it.reference }.toSet()
                _uiState.update { state ->
                    state.copy(
                        bookmarkedRefs = refs,
                        results = state.results.map { it.copy(isBookmarked = refs.contains(it.reference)) }
                    )
                }
            }
        }
    }

    fun onQueryChanged(query: String) {
        _uiState.update { it.copy(query = query) }
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            if (query.isBlank()) {
                _uiState.update { it.copy(results = emptyList(), isSearching = false) }
                return@launch
            }
            _uiState.update { it.copy(isSearching = true) }
            delay(150) // Debounce for instant, smooth typing
            val results = scriptureRepository.searchVerses(query)
            val currentBookmarks = _uiState.value.bookmarkedRefs
            _uiState.update {
                it.copy(
                    results = results.map { v -> v.copy(isBookmarked = currentBookmarks.contains(v.reference)) },
                    isSearching = false
                )
            }
        }
    }

    fun toggleBookmark(verse: VerseItem) {
        viewModelScope.launch {
            scriptureRepository.toggleBookmark(verse)
        }
    }

    fun copyVerse(context: Context, verse: VerseItem) {
        com.thashiznitt.truenorth.util.ScriptureShareHelper.copyToClipboard(
            context = context,
            reference = verse.reference,
            text = verse.text,
            tagId = verse.tagColor
        )
    }

    fun shareVerse(context: Context, verse: VerseItem) {
        com.thashiznitt.truenorth.util.ScriptureShareHelper.shareVerse(
            context = context,
            reference = verse.reference,
            text = verse.text,
            tagId = verse.tagColor
        )
    }

    companion object {
        fun provideFactory(scriptureRepository: ScriptureRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return SearchViewModel(scriptureRepository) as T
                }
            }
    }
}
