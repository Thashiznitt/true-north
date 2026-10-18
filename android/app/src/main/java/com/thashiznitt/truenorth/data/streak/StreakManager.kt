package com.thashiznitt.truenorth.data.streak

import android.content.Context
import android.content.SharedPreferences
import com.thashiznitt.truenorth.data.model.StreakMilestone
import com.thashiznitt.truenorth.data.repository.JournalRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class StreakManager(
    private val context: Context,
    private val journalRepository: JournalRepository,
    private val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
) {
    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val _streakDays = MutableStateFlow(0)
    val streakDays: StateFlow<Int> = _streakDays.asStateFlow()

    private val _activeMilestoneCelebration = MutableStateFlow<StreakMilestone?>(null)
    val activeMilestoneCelebration: StateFlow<StreakMilestone?> = _activeMilestoneCelebration.asStateFlow()

    private val _isStreakDetailsDialogVisible = MutableStateFlow(false)
    val isStreakDetailsDialogVisible: StateFlow<Boolean> = _isStreakDetailsDialogVisible.asStateFlow()

    init {
        scope.launch {
            journalRepository.getAllEntries().collect { entries ->
                val streak = StreakMilestone.calculateStreak(entries)
                val previousStreak = _streakDays.value
                _streakDays.value = streak

                // If streak increased and hit a milestone that hasn't been celebrated, trigger celebration
                if (streak > previousStreak && streak >= 3) {
                    checkAndTriggerMilestoneCelebration(streak)
                }
            }
        }
    }

    fun checkAndTriggerMilestoneCelebration(streak: Int) {
        val lastCelebrated = prefs.getInt(KEY_LAST_CELEBRATED_MILESTONE, 0)
        val milestone = StreakMilestone.getMilestoneForStreak(streak)
        if (milestone != null && milestone.days > lastCelebrated) {
            _activeMilestoneCelebration.value = milestone
            prefs.edit().putInt(KEY_LAST_CELEBRATED_MILESTONE, milestone.days).apply()
        }
    }

    fun dismissMilestoneCelebration() {
        _activeMilestoneCelebration.value = null
    }

    fun showStreakDetailsDialog() {
        _isStreakDetailsDialogVisible.value = true
    }

    fun dismissStreakDetailsDialog() {
        _isStreakDetailsDialogVisible.value = false
    }

    companion object {
        private const val PREFS_NAME = "her_bible_streak_prefs"
        private const val KEY_LAST_CELEBRATED_MILESTONE = "last_celebrated_milestone"
    }
}
