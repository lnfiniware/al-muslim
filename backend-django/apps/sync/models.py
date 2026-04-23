"""Sync models for cross-device data synchronization."""
import uuid
from django.db import models
from django.conf import settings


class SyncedPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="synced_preferences")
    language = models.CharField(max_length=10, default="en")
    theme_mode = models.CharField(max_length=20, default="system")
    madhab = models.CharField(max_length=20, default="SHAFI")
    use_24_hour_format = models.BooleanField(default=True)
    haptics_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user.email}"


class SyncedBookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="synced_bookmarks")
    surah_number = models.IntegerField()
    ayah_number = models.IntegerField()
    surah_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "surah_number", "ayah_number")
        ordering = ["-created_at"]


class SyncedAdhkarProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="synced_adhkar_progress")
    adhkar_id = models.CharField(max_length=100)
    current_count = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "adhkar_id")
