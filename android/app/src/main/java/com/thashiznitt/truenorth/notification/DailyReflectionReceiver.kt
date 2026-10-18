package com.thashiznitt.truenorth.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class DailyReflectionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED -> {
                DailyReflectionNotifier.createNotificationChannel(context)
                DailyReflectionNotifier.scheduleDailyMorningNotification(context)
            }
            DailyReflectionNotifier.ACTION_DAILY_REFLECTION -> {
                DailyReflectionNotifier.showMorningNotification(context)
                DailyReflectionNotifier.scheduleDailyMorningNotification(context)
            }
            else -> {
                DailyReflectionNotifier.showMorningNotification(context)
            }
        }
    }
}
