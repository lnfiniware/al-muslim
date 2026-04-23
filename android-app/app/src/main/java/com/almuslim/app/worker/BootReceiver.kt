package com.almuslim.app.worker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.work.*
import com.almuslim.app.util.Constants
import java.util.concurrent.TimeUnit

/**
 * Reschedule prayer notification workers after device reboot.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            val workRequest = PeriodicWorkRequestBuilder<DailyPrayerScheduleWorker>(
                1, TimeUnit.DAYS,
            )
                .addTag(Constants.PRAYER_SCHEDULE_WORKER_TAG)
                .setConstraints(
                    Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                        .build()
                )
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                Constants.PRAYER_SCHEDULE_WORKER_TAG,
                ExistingPeriodicWorkPolicy.KEEP,
                workRequest,
            )
        }
    }
}
