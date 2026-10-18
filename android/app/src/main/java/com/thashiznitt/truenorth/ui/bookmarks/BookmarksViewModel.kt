package com.thashiznitt.truenorth.ui.bookmarks

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.thashiznitt.truenorth.data.local.entity.BookmarkEntity
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.data.repository.ScriptureRepository
import com.thashiznitt.truenorth.util.ScriptureShareHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

import com.thashiznitt.truenorth.data.model.AnsweredPrayer
import com.thashiznitt.truenorth.data.model.DailySanctuary

data class BookmarksUiState(
    val allBookmarks: List<BookmarkEntity> = emptyList(),
    val filteredBookmarks: List<BookmarkEntity> = emptyList(),
    val selectedTagId: String? = null, // null = ALL
    val tagCounts: Map<String, Int> = emptyMap(),
    val isLoading: Boolean = false,
    val selectedTab: String = "Bookmarks", // "Bookmarks" | "Answered Prayers"
    val selectedCategory: String = "ALL", // "ALL", "Family", "Business", "Peace"
    val answeredPrayers: List<AnsweredPrayer> = DailySanctuary.SampleAnsweredPrayers
) {
    val displayedTestimonies: List<AnsweredPrayer>
        get() {
            if (selectedCategory == "ALL") return answeredPrayers
            return answeredPrayers.filter { it.category.equals(selectedCategory, ignoreCase = true) }
        }
}

class BookmarksViewModel(
    private val scriptureRepository: ScriptureRepository
) : ViewModel() {

    private val _selectedTagId = MutableStateFlow<String?>(null)
    private val _selectedTab = MutableStateFlow("Bookmarks")
    private val _selectedCategory = MutableStateFlow("ALL")

    val uiState: StateFlow<BookmarksUiState> = combine(
        scriptureRepository.getAllBookmarks(),
        _selectedTagId,
        _selectedTab,
        _selectedCategory
    ) { allList, selectedTag, tab, category ->
        val counts = mutableMapOf<String, Int>()
        for (item in allList) {
            val tag = item.tagColor ?: "yellow"
            counts[tag] = (counts[tag] ?: 0) + 1
        }

        val filtered = if (selectedTag == null) {
            allList
        } else {
            allList.filter { (it.tagColor ?: "yellow") == selectedTag }
        }

        BookmarksUiState(
            allBookmarks = allList,
            filteredBookmarks = filtered,
            selectedTagId = selectedTag,
            tagCounts = counts,
            isLoading = false,
            selectedTab = tab,
            selectedCategory = category,
            answeredPrayers = DailySanctuary.SampleAnsweredPrayers
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        BookmarksUiState(isLoading = true)
    )

    fun selectTab(tab: String) {
        _selectedTab.value = tab
    }

    fun selectCategory(category: String) {
        _selectedCategory.value = category
    }

    fun selectTagFilter(tagId: String?) {
        _selectedTagId.value = tagId
    }

    fun removeBookmark(reference: String) {
        viewModelScope.launch {
            scriptureRepository.removeBookmark(reference)
        }
    }

    fun updateBookmarkTag(bookmark: BookmarkEntity, newTagId: String?) {
        viewModelScope.launch {
            val verse = VerseItem(
                bookId = bookmark.bookId,
                bookName = bookmark.bookName,
                chapter = bookmark.chapter,
                verseNumber = bookmark.verseNumber,
                text = bookmark.text
            )
            scriptureRepository.setVerseTag(verse, newTagId)
        }
    }

    fun copyBookmark(context: Context, bookmark: BookmarkEntity) {
        ScriptureShareHelper.copyToClipboard(
            context = context,
            reference = bookmark.reference,
            text = bookmark.text,
            tagId = bookmark.tagColor
        )
    }

    fun shareBookmark(context: Context, bookmark: BookmarkEntity) {
        ScriptureShareHelper.shareVerse(
            context = context,
            reference = bookmark.reference,
            text = bookmark.text,
            tagId = bookmark.tagColor
        )
    }

    companion object {
        fun provideFactory(scriptureRepository: ScriptureRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return BookmarksViewModel(scriptureRepository) as T
                }
            }
    }
}
