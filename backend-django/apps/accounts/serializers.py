"""Account serializers for registration, login, and profile management."""
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, DeviceSession


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ("email", "password", "name")

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if user.is_locked:
            raise serializers.ValidationError("Account is locked. Please try again later.")
        data["user"] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "name")
        read_only_fields = ("id", "email")


class DeviceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceSession
        fields = ("id", "device_name", "device_type", "last_active", "created_at")
        read_only_fields = ("id", "last_active", "created_at")
