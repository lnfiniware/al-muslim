package com.almuslim.app.service

import android.annotation.SuppressLint
import android.content.Context
import android.location.Geocoder
import android.os.Build
import com.almuslim.app.domain.model.LocationData
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

/**
 * Location service using Google Play Services FusedLocationProvider.
 *
 * Provides current location with reverse geocoding for city/country names.
 * Caches the last known location to reduce unnecessary GPS queries.
 *
 * Ported from: src/services/locationService.ts
 */
@Singleton
class LocationService @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    private var cachedLocation: LocationData? = null

    /**
     * Get the current location with city/country via reverse geocoding.
     * Returns cached location if available; call [clearCache] to force refresh.
     */
    @SuppressLint("MissingPermission")
    suspend fun getCurrentLocation(): LocationData? {
        cachedLocation?.let { return it }

        return try {
            val location = suspendCancellableCoroutine { cont ->
                val cancellationToken = CancellationTokenSource()
                fusedLocationClient.getCurrentLocation(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    cancellationToken.token,
                ).addOnSuccessListener { loc ->
                    cont.resume(loc)
                }.addOnFailureListener {
                    cont.resume(null)
                }
                cont.invokeOnCancellation { cancellationToken.cancel() }
            } ?: return null

            val lat = location.latitude
            val lng = location.longitude
            var city: String? = null
            var country: String? = null

            try {
                val geocoder = Geocoder(context, Locale.getDefault())
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    suspendCancellableCoroutine { cont ->
                        geocoder.getFromLocation(lat, lng, 1) { addresses ->
                            if (addresses.isNotEmpty()) {
                                city = addresses[0].locality ?: addresses[0].subAdminArea
                                country = addresses[0].countryName
                            }
                            cont.resume(Unit)
                        }
                    }
                } else {
                    @Suppress("DEPRECATION")
                    val addresses = geocoder.getFromLocation(lat, lng, 1)
                    if (!addresses.isNullOrEmpty()) {
                        city = addresses[0].locality ?: addresses[0].subAdminArea
                        country = addresses[0].countryName
                    }
                }
            } catch (e: Exception) {
                // Geocoding failure is non-fatal; coordinates are still valid
            }

            val locationData = LocationData(
                city = city,
                country = country,
                latitude = lat,
                longitude = lng,
                accuracy = location.accuracy,
            )
            cachedLocation = locationData
            locationData
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Clear the cached location to force a fresh GPS query on next call.
     */
    fun clearCache() {
        cachedLocation = null
    }
}
