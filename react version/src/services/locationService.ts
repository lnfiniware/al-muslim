import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationData {
  city?: string;
  country?: string;
  coordinates: LocationCoordinates;
}

let cachedLocation: LocationData | null = null;

export const locationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  },

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Check if permission is granted
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) {
          console.warn('Location permission not granted');
          return null;
        }
      }

      // Use cached location if available (to reduce API calls)
      if (cachedLocation) {
        return cachedLocation;
      }

      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude, accuracy } = location.coords;

      // Try to get reverse geocode for city name
      let city = 'Unknown';
      let country = 'Unknown';
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (reverseGeocode.length > 0) {
          city = reverseGeocode[0].city || 'Unknown';
          country = reverseGeocode[0].country || 'Unknown';
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

      const locationData: LocationData = {
        city,
        country,
        coordinates: { latitude, longitude, accuracy: accuracy || 0 },
      };

      cachedLocation = locationData;
      return locationData;
    } catch (error) {
      console.error('Get current location error:', error);
      return null;
    }
  },

  async getLocationByCity(city: string): Promise<LocationCoordinates | null> {
    try {
      const results = await Location.geocodeAsync(city);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        return { latitude, longitude };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  clearCache(): void {
    cachedLocation = null;
  },
};
