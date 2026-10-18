package com.thashiznitt.truenorth.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ScriptureVerse(
    val verseNumber: Int,
    val text: String
)

@Serializable
data class ScriptureChapter(
    val chapterNumber: Int,
    val verses: List<ScriptureVerse>
)

@Serializable
data class ScriptureBook(
    val id: String,
    val name: String,
    val testament: String, // "OT" or "NT"
    val chapters: List<ScriptureChapter>
)

data class VerseItem(
    val bookId: String,
    val bookName: String,
    val chapter: Int,
    val verseNumber: Int,
    val text: String,
    val isBookmarked: Boolean = false,
    val tagColor: String? = null // FinderTag id: red, orange, yellow, green, blue, purple, gray
) {
    val reference: String
        get() = "$bookName $chapter:$verseNumber"
}

enum class BibleLanguage(
    val code: String,
    val title: String,
    val shortName: String,
    val assetFile: String
) {
    ENGLISH("en", "English (KJV)", "English", "scriptures.json"),
    SWAHILI("sw", "Kiswahili (Biblia)", "Kiswahili", "scriptures_sw.json");

    companion object {
        fun fromCode(code: String?): BibleLanguage =
            entries.find { it.code.equals(code, ignoreCase = true) } ?: ENGLISH
    }
}

