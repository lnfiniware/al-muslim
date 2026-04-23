package com.almuslim.app.data.remote.dto

import com.squareup.moshi.JsonClass

// ── Auth DTOs ────────────────────────────────────────────────────────────

@JsonClass(generateAdapter = true)
data class RegisterRequest(val email: String, val password: String, val name: String? = null)

@JsonClass(generateAdapter = true)
data class LoginRequest(val email: String, val password: String)

@JsonClass(generateAdapter = true)
data class RefreshTokenRequest(val refresh: String)

@JsonClass(generateAdapter = true)
data class PasswordResetRequest(val email: String)

@JsonClass(generateAdapter = true)
data class PasswordResetConfirmRequest(val token: String, val newPassword: String)

@JsonClass(generateAdapter = true)
data class UpdateProfileRequest(val name: String? = null, val email: String? = null)

@JsonClass(generateAdapter = true)
data class AuthResponse(val access: String, val refresh: String, val user: UserProfileResponse)

@JsonClass(generateAdapter = true)
data class TokenResponse(val access: String)

@JsonClass(generateAdapter = true)
data class UserProfileResponse(val id: String, val email: String, val name: String?)

@JsonClass(generateAdapter = true)
data class DeviceSessionResponse(val id: String, val deviceName: String, val lastActive: String)

@JsonClass(generateAdapter = true)
data class MessageResponse(val message: String)

// ── Sync DTOs ────────────────────────────────────────────────────────────

@JsonClass(generateAdapter = true)
data class SyncPreferencesRequest(
    val language: String? = null,
    val themeMode: String? = null,
    val madhab: String? = null,
    val use24HourFormat: Boolean? = null,
    val hapticsEnabled: Boolean? = null,
)

@JsonClass(generateAdapter = true)
data class SyncPreferencesResponse(
    val language: String,
    val themeMode: String,
    val madhab: String,
    val use24HourFormat: Boolean,
    val hapticsEnabled: Boolean,
)

@JsonClass(generateAdapter = true)
data class SyncBookmarkRequest(val surahNumber: Int, val ayahNumber: Int, val surahName: String)

@JsonClass(generateAdapter = true)
data class SyncBookmarkResponse(val surahNumber: Int, val ayahNumber: Int, val surahName: String, val createdAt: String)

@JsonClass(generateAdapter = true)
data class SyncAdhkarProgressRequest(val adhkarId: String, val currentCount: Int)

@JsonClass(generateAdapter = true)
data class SyncAdhkarProgressResponse(val adhkarId: String, val currentCount: Int, val lastUpdated: String)

// ── Notification DTOs ────────────────────────────────────────────────────

@JsonClass(generateAdapter = true)
data class DeviceTokenRequest(val token: String, val platform: String = "android")

// ── Feedback DTOs ────────────────────────────────────────────────────────

@JsonClass(generateAdapter = true)
data class FeedbackRequest(val subject: String, val body: String, val appVersion: String)
