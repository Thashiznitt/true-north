package com.thashiznitt.truenorth.ui.reader

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.ScriptureBook
import com.thashiznitt.truenorth.data.model.ScriptureChapter
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.data.repository.ScriptureRepository
import com.thashiznitt.truenorth.util.ScriptureShareHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

import com.thashiznitt.truenorth.audio.HerBibleAudioEngine
import com.thashiznitt.truenorth.data.billing.SubscriptionManager

data class ReaderUiState(
    val language: BibleLanguage = BibleLanguage.ENGLISH,
    val books: List<ScriptureBook> = emptyList(),
    val filteredBooks: List<ScriptureBook> = emptyList(),
    val currentTestamentFilter: String = "ALL",
    val selectedBook: ScriptureBook? = null,
    val selectedChapter: ScriptureChapter? = null,
    val verses: List<VerseItem> = emptyList(),
    val bookmarkedRefs: Set<String> = emptySet(),
    val bookmarkTags: Map<String, String> = emptyMap(),
    val selectedFinderTagFilter: String? = null, // null = all verses, or filter by tag
    val isLoading: Boolean = true,
    val isAudioPlaying: Boolean = false,
    val currentAudioTitle: String? = null,
    val isPremium: Boolean = false,
    val isPaywallVisible: Boolean = false
) {
    val displayedVerses: List<VerseItem>
        get() {
            if (selectedFinderTagFilter == null) return verses
            return verses.filter { it.tagColor == selectedFinderTagFilter }
        }
}

class ReaderViewModel(
    private val scriptureRepository: ScriptureRepository,
    private val subscriptionManager: SubscriptionManager? = null,
    private val audioEngine: HerBibleAudioEngine? = null
) : ViewModel() {

    private val _uiState = MutableStateFlow(ReaderUiState())
    val uiState: StateFlow<ReaderUiState> = _uiState.asStateFlow()

    init {
        loadData(scriptureRepository.currentLanguage.value)
        observeBookmarks()
        observeAudio()
        observeSubscription()
    }

    private fun observeSubscription() {
        subscriptionManager?.let { sm ->
            viewModelScope.launch {
                sm.isPremium.collect { premium ->
                    _uiState.update { it.copy(isPremium = premium) }
                }
            }
        }
    }

    private fun observeAudio() {
        audioEngine?.let { engine ->
            viewModelScope.launch {
                engine.isPlaying.collect { playing ->
                    _uiState.update { it.copy(isAudioPlaying = playing) }
                }
            }
            viewModelScope.launch {
                engine.currentTrackTitle.collect { title ->
                    _uiState.update { it.copy(currentAudioTitle = title) }
                }
            }
        }
    }

    private fun loadData(language: BibleLanguage) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, language = language) }
            val books = scriptureRepository.getBooks(language)
            val initialBook = books.find { it.id == "psa" } ?: books.firstOrNull()
            val initialChapter = initialBook?.chapters?.find { it.chapterNumber == 23 } ?: initialBook?.chapters?.firstOrNull()

            _uiState.update {
                it.copy(
                    language = language,
                    books = books,
                    filteredBooks = books,
                    selectedBook = initialBook,
                    selectedChapter = initialChapter,
                    isLoading = false
                )
            }
            updateVerses(initialBook, initialChapter)
        }
    }

    fun setLanguage(language: BibleLanguage) {
        if (_uiState.value.language != language) {
            scriptureRepository.setLanguage(language)
            loadData(language)
        }
    }

    private fun observeBookmarks() {
        viewModelScope.launch {
            scriptureRepository.getAllBookmarks().collect { list ->
                val tagMap = list.associate { it.reference to (it.tagColor ?: "yellow") }
                _uiState.update { state ->
                    state.copy(
                        bookmarkedRefs = tagMap.keys,
                        bookmarkTags = tagMap,
                        verses = state.verses.map { v ->
                            val tag = tagMap[v.reference]
                            v.copy(
                                isBookmarked = tag != null,
                                tagColor = tag
                            )
                        }
                    )
                }
            }
        }
    }

    fun setTestamentFilter(filter: String) {
        _uiState.update { state ->
            val filtered = when (filter) {
                "OT" -> state.books.filter { it.testament == "OT" }
                "NT" -> state.books.filter { it.testament == "NT" }
                else -> state.books
            }
            state.copy(
                currentTestamentFilter = filter,
                filteredBooks = filtered
            )
        }
    }

    fun selectBook(book: ScriptureBook) {
        val chapter = book.chapters.firstOrNull()
        _uiState.update {
            it.copy(
                selectedBook = book,
                selectedChapter = chapter
            )
        }
        updateVerses(book, chapter)
    }

    fun selectChapter(chapter: ScriptureChapter) {
        _uiState.update { it.copy(selectedChapter = chapter) }
        updateVerses(_uiState.value.selectedBook, chapter)
    }

    fun selectBookAndChapter(book: ScriptureBook, chapter: ScriptureChapter) {
        _uiState.update {
            it.copy(
                selectedBook = book,
                selectedChapter = chapter
            )
        }
        updateVerses(book, chapter)
    }

    fun goToNextChapter() {
        val book = _uiState.value.selectedBook ?: return
        val currentChapter = _uiState.value.selectedChapter ?: return
        val currentIndex = book.chapters.indexOfFirst { it.chapterNumber == currentChapter.chapterNumber }
        if (currentIndex != -1 && currentIndex < book.chapters.lastIndex) {
            selectChapter(book.chapters[currentIndex + 1])
        }
    }

    fun goToPreviousChapter() {
        val book = _uiState.value.selectedBook ?: return
        val currentChapter = _uiState.value.selectedChapter ?: return
        val currentIndex = book.chapters.indexOfFirst { it.chapterNumber == currentChapter.chapterNumber }
        if (currentIndex > 0) {
            selectChapter(book.chapters[currentIndex - 1])
        }
    }

    private fun updateVerses(book: ScriptureBook?, chapter: ScriptureChapter?) {
        if (book == null || chapter == null) return
        val currentTags = _uiState.value.bookmarkTags
        val verseItems = chapter.verses.map { v ->
            val ref = "${book.name} ${chapter.chapterNumber}:${v.verseNumber}"
            val tag = currentTags[ref]
            VerseItem(
                bookId = book.id,
                bookName = book.name,
                chapter = chapter.chapterNumber,
                verseNumber = v.verseNumber,
                text = v.text,
                isBookmarked = tag != null,
                tagColor = tag
            )
        }
        _uiState.update { it.copy(verses = verseItems) }
    }

    fun toggleBookmark(verse: VerseItem, defaultTag: String = "yellow") {
        viewModelScope.launch {
            scriptureRepository.toggleBookmark(verse, defaultTag)
        }
    }

    fun highlightVerse(verse: VerseItem, tagId: String?) {
        viewModelScope.launch {
            scriptureRepository.setVerseTag(verse, tagId)
        }
    }

    fun setFinderTagFilter(tagId: String?) {
        _uiState.update { it.copy(selectedFinderTagFilter = tagId) }
    }

    fun copyVerse(context: Context, verse: VerseItem) {
        ScriptureShareHelper.copyToClipboard(
            context = context,
            reference = verse.reference,
            text = verse.text,
            tagId = verse.tagColor
        )
    }

    fun shareVerse(context: Context, verse: VerseItem) {
        ScriptureShareHelper.shareVerse(
            context = context,
            reference = verse.reference,
            text = verse.text,
            tagId = verse.tagColor
        )
    }

    fun playChapterAudio() {
        if (_uiState.value.isPremium) {
            val book = _uiState.value.selectedBook ?: return
            val chapter = _uiState.value.selectedChapter ?: return
            val verses = _uiState.value.verses
            val ref = "${book.name} ${chapter.chapterNumber}"
            val fullText = verses.joinToString(" ") { it.text }
            audioEngine?.playScripture(ref, fullText, _uiState.value.language)
        } else {
            openPaywall()
        }
    }

    fun playVerseAudio(verse: VerseItem) {
        if (_uiState.value.isPremium) {
            audioEngine?.playScripture(verse.reference, verse.text, _uiState.value.language)
        } else {
            openPaywall()
        }
    }

    fun stopAudio() {
        audioEngine?.stop()
    }

    fun openPaywall() {
        _uiState.update { it.copy(isPaywallVisible = true) }
    }

    fun dismissPaywall() {
        _uiState.update { it.copy(isPaywallVisible = false) }
    }

    fun subscribe(isYearly: Boolean) {
        subscriptionManager?.setPremium(true)
        dismissPaywall()
    }

    companion object {
        fun provideFactory(
            scriptureRepository: ScriptureRepository,
            subscriptionManager: SubscriptionManager? = null,
            audioEngine: HerBibleAudioEngine? = null
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return ReaderViewModel(scriptureRepository, subscriptionManager, audioEngine) as T
                }
            }
    }
}
