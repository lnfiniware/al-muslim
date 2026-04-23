from django.contrib import admin
from .models import FeedbackEntry

@admin.register(FeedbackEntry)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("subject", "user", "app_version", "is_reviewed", "created_at")
    list_filter = ("is_reviewed", "app_version")
    search_fields = ("subject", "body")
    readonly_fields = ("created_at",)
