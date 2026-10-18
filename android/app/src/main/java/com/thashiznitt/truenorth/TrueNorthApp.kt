package com.thashiznitt.truenorth

import android.app.Application
import com.thashiznitt.truenorth.di.AppContainer
import com.thashiznitt.truenorth.di.DefaultAppContainer

import com.thashiznitt.truenorth.notification.DailyReflectionNotifier

class TrueNorthApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = DefaultAppContainer(this)
        
        // Initialize daily morning reflection reminder channel and schedule 8:00 AM alarm
        DailyReflectionNotifier.createNotificationChannel(this)
        DailyReflectionNotifier.scheduleDailyMorningNotification(this)
    }
}
