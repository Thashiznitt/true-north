package com.thashiznitt.truenorth.data.repository

import com.thashiznitt.truenorth.data.local.dao.JournalDao
import com.thashiznitt.truenorth.data.local.entity.JournalEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class JournalRepository(
    private val journalDao: JournalDao
) {
    fun getAllEntries(): Flow<List<JournalEntity>> = journalDao.getAllEntries()

    fun searchEntries(query: String): Flow<List<JournalEntity>> = journalDao.searchEntries(query)

    suspend fun getEntryById(id: Long): JournalEntity? = withContext(Dispatchers.IO) {
        journalDao.getEntryById(id)
    }

    suspend fun saveEntry(
        title: String,
        content: String,
        tag: String,
        dateDisplay: String,
        churchName: String? = null,
        speaker: String? = null,
        scriptureReference: String? = null,
        scriptureText: String? = null,
        attachedPhotos: String? = null
    ): Long = withContext(Dispatchers.IO) {
        journalDao.insertEntry(
            JournalEntity(
                title = title.trim(),
                content = content.trim(),
                tag = tag,
                dateDisplay = dateDisplay,
                churchName = churchName?.trim()?.ifEmpty { null },
                speaker = speaker?.trim()?.ifEmpty { null },
                scriptureReference = scriptureReference?.trim()?.ifEmpty { null },
                scriptureText = scriptureText?.trim()?.ifEmpty { null },
                attachedPhotos = attachedPhotos?.trim()?.ifEmpty { null }
            )
        )
    }

    suspend fun updateEntry(entry: JournalEntity) = withContext(Dispatchers.IO) {
        journalDao.updateEntry(entry)
    }

    suspend fun deleteEntry(id: Long) = withContext(Dispatchers.IO) {
        journalDao.deleteEntryById(id)
    }
}
