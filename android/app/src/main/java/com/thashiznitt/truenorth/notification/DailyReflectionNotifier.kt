package com.thashiznitt.truenorth.notification

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.thashiznitt.truenorth.MainActivity
import com.thashiznitt.truenorth.R
import java.util.Calendar

object DailyReflectionNotifier {
    const val CHANNEL_ID = "her_bible_morning_reflections"
    const val NOTIFICATION_ID = 7001
    const val ACTION_DAILY_REFLECTION = "com.thashiznitt.truenorth.ACTION_DAILY_REFLECTION"

    private val MorningInspirations = listOf(
        "Good morning, beloved. Take a peaceful moment to journal your morning prayer and grace.",
        "A new day is a sacred gift. Pause and record what touches your spirit this morning.",
        "“In quietness and trust shall be your strength.” Step into your quiet prayer sanctuary today.",
        "Start your morning rooted in peace. Record today's scripture and blessings."
    )

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Daily Morning Reflections",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Daily morning encouragement to journal your prayers, church notes, and spiritual reflections."
                enableLights(true)
                lightColor = 0xFFC8A95A.toInt() // Soft gold accent
                enableVibration(true)
            }
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    /**
     * Schedules a daily morning push notification for 8:00 AM every day.
     */
    fun scheduleDailyMorningNotification(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, DailyReflectionReceiver::class.java).apply {
            action = ACTION_DAILY_REFLECTION
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            NOTIFICATION_ID,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val calendar = Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            set(Calendar.HOUR_OF_DAY, 8)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        try {
            alarmManager.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                AlarmManager.INTERVAL_DAY,
                pendingIntent
            )
        } catch (_: SecurityException) {
            // Graceful fallback for restricted background environments
        }
    }

    /**
     * Displays the morning reflection push notification.
     */
    fun showMorningNotification(context: Context) {
        createNotificationChannel(context)

        val openAppIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("nav_screen", "journal")
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            NOTIFICATION_ID,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val message = MorningInspirations.random()

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.her_bible_logo)
            .setContentTitle("Her Bible • Morning Grace")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setColor(0xFFC8A95A.toInt()) // SoftGold
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
        } catch (_: SecurityException) {
            // Permission check handled gracefully
        }
    }
}
