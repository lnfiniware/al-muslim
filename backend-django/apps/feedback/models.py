"""Feedback model for user-submitted feedback."""
import uuid
from django.db import models
from django.conf import settings


class FeedbackEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    app_version = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Feedback entries"

    def __str__(self):
        return f"{self.subject} ({self.created_at.strftime('%Y-%m-%d')})"
