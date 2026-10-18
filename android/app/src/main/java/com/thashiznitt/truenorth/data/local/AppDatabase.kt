package com.thashiznitt.truenorth.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.thashiznitt.truenorth.data.local.dao.BookmarkDao
import com.thashiznitt.truenorth.data.local.dao.JournalDao
import com.thashiznitt.truenorth.data.local.entity.BookmarkEntity
import com.thashiznitt.truenorth.data.local.entity.JournalEntity

@Database(
    entities = [BookmarkEntity::class, JournalEntity::class],
    version = 4,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun bookmarkDao(): BookmarkDao
    abstract fun journalDao(): JournalDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "true_north.db"
                ).fallbackToDestructiveMigration()
                 .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
