package com.almuslim.app.util

object Constants {
    const val APP_NAME = "al-muslim"
    const val APP_VERSION = "1.2.1"
    const val APP_DEVELOPER = "Zyad Mohamed"
    const val APP_ORGANIZATION = "Infiniware"

    // Mecca coordinates for Qiblah
    const val MECCA_LATITUDE = 21.4225
    const val MECCA_LONGITUDE = 39.8262

    // Notification channels
    const val PRAYER_NOTIFICATION_CHANNEL_ID = "prayer_notifications"
    const val PRAYER_NOTIFICATION_CHANNEL_NAME = "Prayer Reminders"
    const val GENERAL_NOTIFICATION_CHANNEL_ID = "general_notifications"
    const val GENERAL_NOTIFICATION_CHANNEL_NAME = "General"

    // Worker tags
    const val PRAYER_SCHEDULE_WORKER_TAG = "prayer_schedule_worker"
    const val SYNC_WORKER_TAG = "sync_worker"
}
