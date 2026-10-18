package com.thashiznitt.truenorth.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "bookmarks")
data class BookmarkEntity(
    @PrimaryKey
    val reference: String, // e.g. "Psalms 23:1"
    val bookId: String,
    val bookName: String,
    val chapter: Int,
    val verseNumber: Int,
    val text: String,
    val tagColor: String? = "yellow", // FinderTag id: red, orange, yellow, green, blue, purple, gray
    val createdAt: Long = System.currentTimeMillis()
)
