package com.thashiznitt.truenorth.di

import android.content.Context
import com.thashiznitt.truenorth.data.local.AppDatabase
import com.thashiznitt.truenorth.data.repository.JournalRepository
import com.thashiznitt.truenorth.data.repository.ScriptureRepository

import com.thashiznitt.truenorth.data.billing.SubscriptionManager
import com.thashiznitt.truenorth.data.streak.StreakManager

import com.thashiznitt.truenorth.audio.HerBibleAudioEngine
import com.thashiznitt.truenorth.util.BiometricLockHelper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

interface AppContainer {
    val scriptureRepository: ScriptureRepository
    val journalRepository: JournalRepository
    val subscriptionManager: SubscriptionManager
    val streakManager: StreakManager
    val audioEngine: HerBibleAudioEngine
    val biometricLockHelper: BiometricLockHelper
}

class DefaultAppContainer(private val context: Context) : AppContainer {
    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    private val database: AppDatabase by lazy {
        AppDatabase.getDatabase(context)
    }

    override val scriptureRepository: ScriptureRepository by lazy {
        ScriptureRepository(
            context = context,
            bookmarkDao = database.bookmarkDao()
        )
    }

    override val journalRepository: JournalRepository by lazy {
        JournalRepository(
            journalDao = database.journalDao()
        )
    }

    override val subscriptionManager: SubscriptionManager by lazy {
        SubscriptionManager(context)
    }

    override val streakManager: StreakManager by lazy {
        StreakManager(
            context = context,
            journalRepository = journalRepository
        )
    }

    override val audioEngine: HerBibleAudioEngine by lazy {
        HerBibleAudioEngine(
            context = context,
            scope = appScope
        )
    }

    override val biometricLockHelper: BiometricLockHelper by lazy {
        BiometricLockHelper(context)
    }
}
