// Unified Navigation & Geolocation Engine for LankaMate
// Provides reusable Google Maps deep-linking, distance calculation, and GPS handling
import { findClosestSriLankanHub } from './locationHelper';

export interface Coordinates {
  lat: number;
  lng: number;
}

// Sri Lanka geographic boundaries (generous bounding box covering all land, coastal waters, and outlying islands)
export const SRI_LANKA_BOUNDS = {
  minLat: 5.5,
  maxLat: 10.5,
  minLng: 79.0,
  maxLng: 82.5,
};

// Colombo Central Coordinates (Used as friendly fallback ONLY when GPS cannot genuinely be obtained)
export const SRI_LANKA_DEFAULT_CENTER: Coordinates = {
  lat: 6.9271,
  lng: 79.8612,
};

/**
 * Checks if coordinate pair lies within Sri Lanka's island territory.
 */
export function isWithinSriLanka(coords: Coordinates): boolean {
  return (
    coords.lat >= SRI_LANKA_BOUNDS.minLat &&
    coords.lat <= SRI_LANKA_BOUNDS.maxLat &&
    coords.lng >= SRI_LANKA_BOUNDS.minLng &&
    coords.lng <= SRI_LANKA_BOUNDS.maxLng
  );
}

/**
 * Calculates great-circle distance between two geographical points in kilometers (Haversine formula).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance < 10 ? Math.round(distance * 10) / 10 : Math.round(distance);
}

/**
 * Formats a distance in kilometers into a user-friendly string.
 */
export function formatDistanceKm(distanceKm?: number | null): string {
  if (distanceKm === undefined || distanceKm === null) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Generates an official Google Maps Directions universal URL.
 * On mobile devices (iOS/Android), this link triggers the installed Google Maps app directly.
 * On desktop browsers, it opens Google Maps directions web interface.
 */
export function getGoogleMapsDirectionsUrl(
  lat: number,
  lng: number,
  placeName?: string
): string {
  const encodedName = placeName ? encodeURIComponent(placeName) : '';
  // Google Maps Universal Directions URL format:
  if (encodedName) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_name=${encodedName}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

/**
 * Opens Google Maps Navigation in a new browser tab or launches native Google Maps application.
 */
export function openGoogleMapsDirections(
  lat: number,
  lng: number,
  placeName?: string
): void {
  const url = getGoogleMapsDirectionsUrl(lat, lng, placeName);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export interface GeolocationResult {
  coordinates: Coordinates | null;
  isRealGps: boolean;
  isInsideSriLanka: boolean;
  accuracy?: number;
  nearestHubName?: string;
  nearestHubDistrict?: string;
  error?: string;
  errorCode?: number; // 1: PERMISSION_DENIED, 2: POSITION_UNAVAILABLE, 3: TIMEOUT, 4: INSECURE_CONTEXT, 5: NOT_SUPPORTED
  errorName?: string;
  timestamp?: number;
}

/**
 * Reusable helper to prompt for device geolocation using real GPS sensor.
 * Uses high-accuracy primary attempt with mobile-friendly timeout and graceful
 * secondary attempt, strictly returning actual device coordinates when granted.
 */
export function requestUserLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    let hasResolved = false;
    let safeguardTimer: ReturnType<typeof setTimeout> | null = null;

    const safeResolve = (result: GeolocationResult) => {
      if (!hasResolved) {
        hasResolved = true;
        if (safeguardTimer) {
          clearTimeout(safeguardTimer);
          safeguardTimer = null;
        }
        resolve(result);
      }
    };

    // 1. Mobile HTTPS & Browser environment check (Requirement 9)
    if (
      typeof window !== 'undefined' &&
      window.isSecureContext === false &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      safeResolve({
        coordinates: null,
        isRealGps: false,
        isInsideSriLanka: false,
        errorCode: 4,
        errorName: 'INSECURE_CONTEXT',
        error: 'Geolocation requires a secure connection (HTTPS). Please open LankaMate over HTTPS.',
      });
      return;
    }

    // 2. Browser Geolocation API support check
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      safeResolve({
        coordinates: null,
        isRealGps: false,
        isInsideSriLanka: false,
        errorCode: 5,
        errorName: 'NOT_SUPPORTED',
        error: 'Geolocation is not supported by your browser or device.',
      });
      return;
    }

    const processPosition = (position: GeolocationPosition) => {
      const coords: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const accuracy = position.coords.accuracy ? Math.round(position.coords.accuracy) : undefined;
      const inside = isWithinSriLanka(coords);

      let nearestHubName: string | undefined;
      let nearestHubDistrict: string | undefined;

      try {
        const { hub, distanceKm } = findClosestSriLankanHub(coords.lat, coords.lng);
        if (distanceKm < 15) {
          nearestHubName = `Near ${hub.name}`;
          nearestHubDistrict = hub.district;
        } else if (distanceKm < 35) {
          nearestHubName = `${hub.name} Area`;
          nearestHubDistrict = hub.district;
        } else {
          nearestHubName = hub.region;
          nearestHubDistrict = hub.province;
        }
      } catch {
        // ignore
      }

      safeResolve({
        coordinates: coords,
        isRealGps: true,
        isInsideSriLanka: inside,
        accuracy,
        nearestHubName,
        nearestHubDistrict,
        timestamp: position.timestamp || Date.now(),
      });
    };

    // Safeguard timeout to ensure promise never hangs indefinitely
    safeguardTimer = setTimeout(() => {
      safeResolve({
        coordinates: null,
        isRealGps: false,
        isInsideSriLanka: false,
        errorCode: 3,
        errorName: 'TIMEOUT',
        error: 'GPS acquisition timed out. Please ensure Location is enabled in your device settings and tap Retry GPS.',
      });
    }, 26000);

    let watchId: number | null = null;

    const cleanupWatch = () => {
      if (watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          navigator.geolocation.clearWatch(watchId);
        } catch {
          // ignore
        }
        watchId = null;
      }
    };

    // Primary mobile approach: watchPosition delivers the first available fused fix immediately,
    // avoiding the common single-shot satellite lock stall in mobile Chromium/Safari.
    try {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          cleanupWatch();
          processPosition(position);
        },
        (error) => {
          cleanupWatch();

          // Requirement 7: Explicit permission denied copy
          if (error.code === error.PERMISSION_DENIED) {
            safeResolve({
              coordinates: null,
              isRealGps: false,
              isInsideSriLanka: false,
              errorCode: 1,
              errorName: 'PERMISSION_DENIED',
              error: 'Location permission was denied. Please allow location access in your device or browser settings.',
            });
            return;
          }

          // If watchPosition had a non-permission error (e.g. timeout or unavailable),
          // attempt a secondary standard getCurrentPosition as immediate fallback
          navigator.geolocation.getCurrentPosition(
            (fallbackPos) => {
              processPosition(fallbackPos);
            },
            (fallbackErr) => {
              let errorMsg = 'Could not acquire GPS location from your device.';
              let errorName = 'UNKNOWN_ERROR';

              if (fallbackErr.code === fallbackErr.PERMISSION_DENIED) {
                errorMsg = 'Location permission was denied. Please allow location access in your device or browser settings.';
                errorName = 'PERMISSION_DENIED';
              } else if (fallbackErr.code === fallbackErr.TIMEOUT) {
                // Requirement 8: Explicit timeout copy
                errorMsg = 'GPS acquisition timed out. Please ensure Location is enabled in your device settings and tap Retry GPS.';
                errorName = 'TIMEOUT';
              } else if (fallbackErr.code === fallbackErr.POSITION_UNAVAILABLE) {
                errorMsg = 'Device location is currently unavailable. Please verify device GPS / Location services are active and tap Retry GPS.';
                errorName = 'POSITION_UNAVAILABLE';
              }

              safeResolve({
                coordinates: null,
                isRealGps: false,
                isInsideSriLanka: false,
                errorCode: fallbackErr.code,
                errorName,
                error: errorMsg,
              });
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 120000,
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000,
        }
      );
    } catch {
      cleanupWatch();
      // If watchPosition fails synchronously, call getCurrentPosition directly
      navigator.geolocation.getCurrentPosition(
        (position) => {
          processPosition(position);
        },
        (error) => {
          let errorMsg = 'Could not acquire GPS location from your device.';
          let errorName = 'UNKNOWN_ERROR';

          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied. Please allow location access in your device or browser settings.';
            errorName = 'PERMISSION_DENIED';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'GPS acquisition timed out. Please ensure Location is enabled in your device settings and tap Retry GPS.';
            errorName = 'TIMEOUT';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Device location is currently unavailable. Please verify device GPS / Location services are active and tap Retry GPS.';
            errorName = 'POSITION_UNAVAILABLE';
          }

          safeResolve({
            coordinates: null,
            isRealGps: false,
            isInsideSriLanka: false,
            errorCode: error.code,
            errorName,
            error: errorMsg,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    }
  });
}

