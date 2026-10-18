package com.thashiznitt.truenorth.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.thashiznitt.truenorth.data.local.entity.BookmarkEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM bookmarks ORDER BY createdAt DESC")
    fun getAllBookmarks(): Flow<List<BookmarkEntity>>

    @Query("SELECT * FROM bookmarks WHERE tagColor = :tagColor ORDER BY createdAt DESC")
    fun getBookmarksByTag(tagColor: String): Flow<List<BookmarkEntity>>

    @Query("SELECT EXISTS(SELECT 1 FROM bookmarks WHERE reference = :reference)")
    fun isBookmarkedFlow(reference: String): Flow<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM bookmarks WHERE reference = :reference)")
    suspend fun isBookmarked(reference: String): Boolean

    @Query("SELECT * FROM bookmarks WHERE reference = :reference LIMIT 1")
    suspend fun getBookmarkByReference(reference: String): BookmarkEntity?

    @Query("SELECT * FROM bookmarks")
    suspend fun getAllBookmarksList(): List<BookmarkEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBookmark(bookmark: BookmarkEntity)

    @Query("DELETE FROM bookmarks WHERE reference = :reference")
    suspend fun deleteBookmarkByReference(reference: String)

    @Query("UPDATE bookmarks SET tagColor = :tagColor WHERE reference = :reference")
    suspend fun updateTagColor(reference: String, tagColor: String?)
}
