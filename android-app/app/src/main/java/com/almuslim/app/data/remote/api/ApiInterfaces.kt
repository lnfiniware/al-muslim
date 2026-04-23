package com.almuslim.app.data.remote.api

import com.almuslim.app.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Authentication API endpoints.
 */
interface AuthApi {

    @POST("api/auth/register/")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login/")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/refresh/")
    suspend fun refreshToken(@Body request: RefreshTokenRequest): Response<TokenResponse>

    @POST("api/auth/password-reset/")
    suspend fun requestPasswordReset(@Body request: PasswordResetRequest): Response<MessageResponse>

    @POST("api/auth/password-reset-confirm/")
    suspend fun confirmPasswordReset(@Body request: PasswordResetConfirmRequest): Response<MessageResponse>

    @GET("api/auth/profile/")
    suspend fun getProfile(): Response<UserProfileResponse>

    @PUT("api/auth/profile/")
    suspend fun updateProfile(@Body request: UpdateProfileRequest): Response<UserProfileResponse>

    @GET("api/auth/sessions/")
    suspend fun getSessions(): Response<List<DeviceSessionResponse>>

    @DELETE("api/auth/sessions/{id}/")
    suspend fun deleteSession(@Path("id") sessionId: String): Response<Unit>
}

/**
 * Main app API endpoints for sync and feedback.
 */
interface AlMuslimApi {

    @GET("api/sync/preferences/")
    suspend fun getPreferences(): Response<SyncPreferencesResponse>

    @POST("api/sync/preferences/")
    suspend fun syncPreferences(@Body request: SyncPreferencesRequest): Response<SyncPreferencesResponse>

    @GET("api/sync/bookmarks/")
    suspend fun getBookmarks(): Response<List<SyncBookmarkResponse>>

    @POST("api/sync/bookmarks/")
    suspend fun syncBookmarks(@Body request: List<SyncBookmarkRequest>): Response<List<SyncBookmarkResponse>>

    @GET("api/sync/adhkar-progress/")
    suspend fun getAdhkarProgress(): Response<List<SyncAdhkarProgressResponse>>

    @POST("api/sync/adhkar-progress/")
    suspend fun syncAdhkarProgress(@Body request: List<SyncAdhkarProgressRequest>): Response<List<SyncAdhkarProgressResponse>>

    @POST("api/notifications/register/")
    suspend fun registerDeviceToken(@Body request: DeviceTokenRequest): Response<MessageResponse>

    @POST("api/feedback/")
    suspend fun submitFeedback(@Body request: FeedbackRequest): Response<MessageResponse>
}
