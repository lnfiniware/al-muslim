"""Sync serializers."""
from rest_framework import serializers
from .models import SyncedPreference, SyncedBookmark, SyncedAdhkarProgress


class SyncedPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncedPreference
        fields = ("language", "theme_mode", "madhab", "use_24_hour_format", "haptics_enabled")


class SyncedBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncedBookmark
        fields = ("surah_number", "ayah_number", "surah_name", "created_at")
        read_only_fields = ("created_at",)


class SyncedAdhkarProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncedAdhkarProgress
        fields = ("adhkar_id", "current_count", "last_updated")
        read_only_fields = ("last_updated",)
