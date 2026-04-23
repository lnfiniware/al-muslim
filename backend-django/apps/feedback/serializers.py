from rest_framework import serializers
from .models import FeedbackEntry

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackEntry
        fields = ("subject", "body", "app_version")
