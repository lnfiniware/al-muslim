package com.almuslim.app.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.almuslim.app.R
import com.almuslim.app.data.local.datastore.UserPreferences
import com.almuslim.app.domain.model.Madhab
import com.almuslim.app.domain.model.PrayerName
import com.almuslim.app.service.LocationService
import com.almuslim.app.service.PrayerCalculationService
import com.almuslim.app.util.Constants
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.flow.first
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Worker that runs daily to calculate prayer times and post
 * notifications for the next upcoming prayer.
 *
 * Scheduled as a periodic work request (every 24 hours) and
 * re-registered on boot via BootReceiver.
 */
@HiltWorker
class DailyPrayerScheduleWorker @AssistedInject constructor(
    @Assisted private val appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val locationService: LocationService,
    private val prayerService: PrayerCalculationService,
    private val userPreferences: UserPreferences,
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        return try {
            ensureNotificationChannel()

            val settings = userPreferences.settingsFlow.first()
            if (!settings.notificationsEnabled) return Result.success()

            val location = locationService.getCurrentLocation() ?: return Result.retry()
            val madhab = if (settings.madhab == "HANAFI") Madhab.HANAFI else Madhab.SHAFI
            val dailyPrayers = prayerService.getPrayerTimes(
                date = LocalDate.now(),
                latitude = location.latitude,
                longitude = location.longitude,
                madhab = madhab,
                use24Hour = settings.use24HourFormat,
            )

            val now = LocalDateTime.now()
            val nextPrayer = prayerService.getNextPrayer(dailyPrayers, now)

            if (nextPrayer != null && nextPrayer.name != PrayerName.SUNRISE) {
                postPrayerNotification(
                    prayerName = nextPrayer.name.displayName,
                    prayerTime = nextPrayer.timeString,
                )
            }

            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }

    private fun ensureNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                Constants.PRAYER_NOTIFICATION_CHANNEL_ID,
                Constants.PRAYER_NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = "Notifications for upcoming prayer times"
                enableVibration(true)
            }

            val manager = appContext.getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun postPrayerNotification(prayerName: String, prayerTime: String) {
        val launchIntent = appContext.packageManager
            .getLaunchIntentForPackage(appContext.packageName)
            ?.apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP }

        val pendingIntent = PendingIntent.getActivity(
            appContext, 0, launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val notification = NotificationCompat.Builder(appContext, Constants.PRAYER_NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("$prayerName Prayer")
            .setContentText("Time for $prayerName prayer at $prayerTime")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        val manager = appContext.getSystemService(NotificationManager::class.java)
        manager.notify(prayerName.hashCode(), notification)
    }
}
