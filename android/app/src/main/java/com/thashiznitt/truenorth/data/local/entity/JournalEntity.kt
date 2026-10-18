package com.thashiznitt.truenorth.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "journal_entries")
data class JournalEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val content: String,
    val tag: String = "Gratitude", // Church, Sermon, Prayer, Peace, Reflection, Gratitude
    val dateDisplay: String,
    val timestamp: Long = System.currentTimeMillis(),
    val churchName: String? = null,
    val speaker: String? = null,
    val scriptureReference: String? = null,
    val scriptureText: String? = null,
    val attachedPhotos: String? = null // Comma-separated drawable names: e.g. "daily_zen_blossom,hero_daily_bread"
)
