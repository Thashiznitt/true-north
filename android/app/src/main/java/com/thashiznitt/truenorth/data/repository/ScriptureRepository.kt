package com.thashiznitt.truenorth.data.repository

import android.content.Context
import com.thashiznitt.truenorth.data.local.dao.BookmarkDao
import com.thashiznitt.truenorth.data.local.entity.BookmarkEntity
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.DailyAffirmation
import com.thashiznitt.truenorth.data.model.ScriptureBook
import com.thashiznitt.truenorth.data.model.VerseItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream
import java.util.Calendar

class ScriptureRepository(
    private val context: Context,
    private val bookmarkDao: BookmarkDao
) {
    private val json = Json { ignoreUnknownKeys = true }
    private val prefs = context.getSharedPreferences("truenorth_bible_prefs", Context.MODE_PRIVATE)

    private val _currentLanguage = MutableStateFlow(
        BibleLanguage.fromCode(prefs.getString("selected_language", BibleLanguage.ENGLISH.code))
    )
    val currentLanguage: StateFlow<BibleLanguage> = _currentLanguage.asStateFlow()

    private val cachedBooksMap = mutableMapOf<BibleLanguage, List<ScriptureBook>>()
    private val cachedFlatVersesMap = mutableMapOf<BibleLanguage, List<VerseItem>>()
    private var cachedAffirmations: List<DailyAffirmation>? = null

    fun setLanguage(language: BibleLanguage) {
        if (_currentLanguage.value != language) {
            _currentLanguage.value = language
            prefs.edit().putString("selected_language", language.code).apply()
        }
    }

    @OptIn(ExperimentalSerializationApi::class)
    suspend fun getBooks(language: BibleLanguage = _currentLanguage.value): List<ScriptureBook> = withContext(Dispatchers.IO) {
        cachedBooksMap[language] ?: run {
            val books = context.assets.open(language.assetFile).use { stream ->
                json.decodeFromStream<List<ScriptureBook>>(stream)
            }
            cachedBooksMap[language] = books
            flattenVerses(language, books)
            books
        }
    }

    private fun flattenVerses(language: BibleLanguage, books: List<ScriptureBook>) {
        val list = ArrayList<VerseItem>(32000)
        for (book in books) {
            for (chapter in book.chapters) {
                for (verse in chapter.verses) {
                    list.add(
                        VerseItem(
                            bookId = book.id,
                            bookName = book.name,
                            chapter = chapter.chapterNumber,
                            verseNumber = verse.verseNumber,
                            text = verse.text
                        )
                    )
                }
            }
        }
        cachedFlatVersesMap[language] = list
    }

    suspend fun getBook(bookId: String, language: BibleLanguage = _currentLanguage.value): ScriptureBook? = withContext(Dispatchers.IO) {
        getBooks(language).find { it.id.equals(bookId, ignoreCase = true) }
    }

    suspend fun getAffirmations(): List<DailyAffirmation> = withContext(Dispatchers.IO) {
        cachedAffirmations ?: run {
            val jsonString = context.assets.open("affirmations.json").bufferedReader().use { it.readText() }
            val affirmations = json.decodeFromString<List<DailyAffirmation>>(jsonString)
            cachedAffirmations = affirmations
            affirmations
        }
    }

    suspend fun getVerseOfTheDay(seedOffset: Int = 0, language: BibleLanguage = _currentLanguage.value): VerseItem = withContext(Dispatchers.IO) {
        getBooks(language)
        val verses = cachedFlatVersesMap[language] ?: emptyList()
        if (verses.isEmpty()) {
            return@withContext VerseItem("psa", "Psalms", 23, 1, "The Lord is my shepherd; I shall not want.")
        }
        // Deterministic daily selection based on day of year + seedOffset
        val cal = Calendar.getInstance()
        val dayOfYear = cal.get(Calendar.DAY_OF_YEAR) + cal.get(Calendar.YEAR) + seedOffset
        val index = Math.floorMod(dayOfYear, verses.size)
        val selected = verses[index]
        val bookmark = bookmarkDao.getBookmarkByReference(selected.reference)
        selected.copy(isBookmarked = bookmark != null, tagColor = bookmark?.tagColor)
    }

    suspend fun getAffirmationOfTheDay(): DailyAffirmation = withContext(Dispatchers.IO) {
        val list = getAffirmations()
        if (list.isEmpty()) {
            return@withContext DailyAffirmation("1", "Peace be with your soul.", "Philippians 4:7", "Peace", "Rest in His grace.")
        }
        val cal = Calendar.getInstance()
        val dayOfYear = cal.get(Calendar.DAY_OF_YEAR)
        val index = Math.floorMod(dayOfYear, list.size)
        list[index]
    }

    suspend fun searchVerses(query: String, language: BibleLanguage = _currentLanguage.value): List<VerseItem> = withContext(Dispatchers.IO) {
        getBooks(language)
        val clean = query.trim()
        if (clean.isBlank()) return@withContext emptyList()
        val flat = cachedFlatVersesMap[language] ?: return@withContext emptyList()
        flat.filter {
            it.text.contains(clean, ignoreCase = true) ||
            it.bookName.contains(clean, ignoreCase = true) ||
            it.reference.contains(clean, ignoreCase = true)
        }.take(50)
    }

    fun getAllBookmarks(): Flow<List<BookmarkEntity>> = bookmarkDao.getAllBookmarks()

    fun getBookmarksByTag(tagColor: String): Flow<List<BookmarkEntity>> =
        bookmarkDao.getBookmarksByTag(tagColor)

    suspend fun getAllBookmarksList(): List<BookmarkEntity> = withContext(Dispatchers.IO) {
        bookmarkDao.getAllBookmarksList()
    }

    fun isBookmarkedFlow(reference: String): Flow<Boolean> = bookmarkDao.isBookmarkedFlow(reference)

    suspend fun toggleBookmark(verse: VerseItem, tagColor: String? = "yellow") = withContext(Dispatchers.IO) {
        val existing = bookmarkDao.getBookmarkByReference(verse.reference)
        if (existing != null && (tagColor == null || existing.tagColor == tagColor)) {
            bookmarkDao.deleteBookmarkByReference(verse.reference)
        } else {
            bookmarkDao.insertBookmark(
                BookmarkEntity(
                    reference = verse.reference,
                    bookId = verse.bookId,
                    bookName = verse.bookName,
                    chapter = verse.chapter,
                    verseNumber = verse.verseNumber,
                    text = verse.text,
                    tagColor = tagColor ?: "yellow"
                )
            )
        }
    }

    suspend fun setVerseTag(verse: VerseItem, tagColor: String?) = withContext(Dispatchers.IO) {
        if (tagColor == null) {
            bookmarkDao.deleteBookmarkByReference(verse.reference)
        } else {
            bookmarkDao.insertBookmark(
                BookmarkEntity(
                    reference = verse.reference,
                    bookId = verse.bookId,
                    bookName = verse.bookName,
                    chapter = verse.chapter,
                    verseNumber = verse.verseNumber,
                    text = verse.text,
                    tagColor = tagColor
                )
            )
        }
    }

    suspend fun removeBookmark(reference: String) = withContext(Dispatchers.IO) {
        bookmarkDao.deleteBookmarkByReference(reference)
    }
}

