from django.contrib import admin
from .models import SyncedPreference, SyncedBookmark, SyncedAdhkarProgress

@admin.register(SyncedPreference)
class SyncedPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "language", "theme_mode", "madhab", "updated_at")

@admin.register(SyncedBookmark)
class SyncedBookmarkAdmin(admin.ModelAdmin):
    list_display = ("user", "surah_number", "ayah_number", "surah_name", "created_at")

@admin.register(SyncedAdhkarProgress)
class SyncedAdhkarProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "adhkar_id", "current_count", "last_updated")
