package com.almuslim.app.data.remote.interceptor

import com.almuslim.app.data.local.datastore.UserPreferences
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

/**
 * OkHttp interceptor that attaches the JWT access token to authenticated requests.
 *
 * Reads the token from encrypted shared preferences. Requests to auth
 * endpoints (login, register, refresh) are excluded.
 */
@Singleton
class AuthInterceptor @Inject constructor(
    private val tokenManager: TokenManager,
) : Interceptor {

    companion object {
        private val EXCLUDED_PATHS = setOf(
            "api/auth/login/",
            "api/auth/register/",
            "api/auth/refresh/",
            "api/auth/password-reset/",
        )
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val path = request.url.encodedPath.trimStart('/')

        if (EXCLUDED_PATHS.any { path.endsWith(it) }) {
            return chain.proceed(request)
        }

        val token = tokenManager.getAccessToken()
        if (token.isNullOrBlank()) {
            return chain.proceed(request)
        }

        val authenticatedRequest = request.newBuilder()
            .header("Authorization", "Bearer $token")
            .build()

        return chain.proceed(authenticatedRequest)
    }
}

/**
 * Manages JWT token storage using encrypted shared preferences.
 */
@Singleton
class TokenManager @Inject constructor(
    @dagger.hilt.android.qualifiers.ApplicationContext private val context: android.content.Context,
) {
    companion object {
        private const val PREFS_NAME = "al_muslim_auth"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
    }

    private val prefs by lazy {
        try {
            androidx.security.crypto.EncryptedSharedPreferences.create(
                PREFS_NAME,
                androidx.security.crypto.MasterKeys.getOrCreate(
                    androidx.security.crypto.MasterKeys.AES256_GCM_SPEC
                ),
                context,
                androidx.security.crypto.EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                androidx.security.crypto.EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
            )
        } catch (e: Exception) {
            // Fallback to regular prefs if encrypted fails (shouldn't happen in production)
            context.getSharedPreferences(PREFS_NAME, android.content.Context.MODE_PRIVATE)
        }
    }

    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)
    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH_TOKEN, null)

    fun saveTokens(accessToken: String, refreshToken: String) {
        prefs.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply()
    }

    fun clearTokens() {
        prefs.edit().clear().apply()
    }

    fun isLoggedIn(): Boolean = !getAccessToken().isNullOrBlank()
}
