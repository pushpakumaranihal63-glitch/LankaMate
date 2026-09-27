// Geolocation and Sri Lankan Travel Hub Utilities

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface SriLankanHub {
  id: string;
  name: string;
  district: string;
  province: string;
  region: string;
  coordinates: GeoPoint;
  isPopularSearch?: boolean;
}

export interface DetectedLocationInfo {
  coordinates: GeoPoint;
  displayName: string;
  city: string;
  areaOrDistrict?: string;
  country: string;
  isWithinSriLanka: boolean;
  closestSriLankaHub?: SriLankanHub;
  source: 'gps' | 'manual';
}

// Sri Lanka geographic bounds approximately:
// Lat: 5.85° N to 9.95° N
// Lng: 79.60° E to 82.00° E
export const SRI_LANKA_BOUNDS = {
  minLat: 5.85,
  maxLat: 9.95,
  minLng: 79.6,
  maxLng: 82.0,
};

export function isCoordinatesInSriLanka(lat: number, lng: number): boolean {
  return (
    lat >= SRI_LANKA_BOUNDS.minLat &&
    lat <= SRI_LANKA_BOUNDS.maxLat &&
    lng >= SRI_LANKA_BOUNDS.minLng &&
    lng <= SRI_LANKA_BOUNDS.maxLng
  );
}

// Curated list of popular Sri Lanka destination cities & tourist regions for hotel search
export const SRI_LANKAN_HUBS: SriLankanHub[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    district: 'Colombo District',
    province: 'Western Province',
    region: 'Western & Urban',
    coordinates: { lat: 6.9271, lng: 79.8612 },
    isPopularSearch: true,
  },
  {
    id: 'galle',
    name: 'Galle & Galle Fort',
    district: 'Galle District',
    province: 'Southern Province',
    region: 'Southern Coast',
    coordinates: { lat: 6.0535, lng: 80.221 },
    isPopularSearch: true,
  },
  {
    id: 'kandy',
    name: 'Kandy',
    district: 'Kandy District',
    province: 'Central Province',
    region: 'Cultural Triangle',
    coordinates: { lat: 7.2906, lng: 80.6337 },
    isPopularSearch: true,
  },
  {
    id: 'ella',
    name: 'Ella',
    district: 'Badulla District',
    province: 'Uva Province',
    region: 'Hill Country',
    coordinates: { lat: 6.8667, lng: 81.0466 },
    isPopularSearch: true,
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya & Dambulla',
    district: 'Matale District',
    province: 'Central Province',
    region: 'Cultural Triangle',
    coordinates: { lat: 7.957, lng: 80.76 },
    isPopularSearch: true,
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    district: 'Nuwara Eliya District',
    province: 'Central Province',
    region: 'Hill Country',
    coordinates: { lat: 6.9497, lng: 80.7891 },
    isPopularSearch: true,
  },
  {
    id: 'mirissa',
    name: 'Mirissa & Weligama',
    district: 'Matara District',
    province: 'Southern Province',
    region: 'Southern Coast',
    coordinates: { lat: 5.9483, lng: 80.4578 },
    isPopularSearch: true,
  },
  {
    id: 'yala',
    name: 'Yala & Tissamaharama',
    district: 'Hambantota District',
    province: 'Southern Province',
    region: 'Wildlife & Safari',
    coordinates: { lat: 6.2731, lng: 81.4284 },
    isPopularSearch: true,
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    district: 'Jaffna District',
    province: 'Northern Province',
    region: 'Northern Peninsula',
    coordinates: { lat: 9.6615, lng: 80.0255 },
    isPopularSearch: true,
  },
  {
    id: 'bentota',
    name: 'Bentota & Beruwala',
    district: 'Galle / Kalutara',
    province: 'Southern Province',
    region: 'Southern Coast',
    coordinates: { lat: 6.4259, lng: 79.9959 },
    isPopularSearch: false,
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee & Nilaveli',
    district: 'Trincomalee District',
    province: 'Eastern Province',
    region: 'Eastern Coast',
    coordinates: { lat: 8.5874, lng: 81.2152 },
    isPopularSearch: false,
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    district: 'Anuradhapura District',
    province: 'North Central Province',
    region: 'Cultural Triangle',
    coordinates: { lat: 8.3114, lng: 80.4037 },
    isPopularSearch: false,
  },
  {
    id: 'negombo',
    name: 'Negombo (Airport)',
    district: 'Gampaha District',
    province: 'Western Province',
    region: 'Western & Urban',
    coordinates: { lat: 7.2008, lng: 79.8736 },
    isPopularSearch: false,
  },
  {
    id: 'tangalle',
    name: 'Tangalle & Dickwella',
    district: 'Hambantota District',
    province: 'Southern Province',
    region: 'Southern Coast',
    coordinates: { lat: 6.0244, lng: 80.7941 },
    isPopularSearch: false,
  },
  {
    id: 'hatton',
    name: 'Hatton & Castlereagh',
    district: 'Nuwara Eliya District',
    province: 'Central Province',
    region: 'Hill Country',
    coordinates: { lat: 6.8778, lng: 80.6052 },
    isPopularSearch: false,
  },
];

// Great-circle distance between two points in km (Haversine formula)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist);
}

// Find closest known Sri Lankan hub to given coordinates
export function findClosestSriLankanHub(lat: number, lng: number): { hub: SriLankanHub; distanceKm: number } {
  let closestHub = SRI_LANKAN_HUBS[0];
  let minDistance = Infinity;

  for (const hub of SRI_LANKAN_HUBS) {
    const dist = calculateDistanceKm(lat, lng, hub.coordinates.lat, hub.coordinates.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestHub = hub;
    }
  }

  return { hub: closestHub, distanceKm: minDistance };
}

// Reverse geocode with graceful timeout and fallback
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<{
  displayName: string;
  city: string;
  areaOrDistrict?: string;
  country: string;
}> {
  const inSL = isCoordinatesInSriLanka(lat, lng);
  const { hub } = findClosestSriLankanHub(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const country = addr.country || (inSL ? 'Sri Lanka' : 'Detected Country');
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.suburb ||
        addr.municipality ||
        addr.city_district ||
        addr.county ||
        (inSL ? hub.name : 'Current Location');
      const area =
        addr.suburb ||
        addr.neighbourhood ||
        addr.state_district ||
        addr.state ||
        (inSL ? hub.district : undefined);

      const parts: string[] = [];
      if (city && city !== 'Current Location') parts.push(city);
      if (area && area !== city) parts.push(area);
      if (country && !parts.includes(country)) parts.push(country);

      return {
        displayName: parts.join(', ') || (inSL ? `${hub.name}, Sri Lanka` : `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`),
        city: city || (inSL ? hub.name : 'Current Location'),
        areaOrDistrict: area,
        country,
      };
    }
  } catch {
    // Network or timeout failure - fall through to fallback
  }

  // Fallback if reverse geocoding is unreachable
  if (inSL) {
    return {
      displayName: `${hub.name}, ${hub.province}, Sri Lanka`,
      city: hub.name,
      areaOrDistrict: hub.district,
      country: 'Sri Lanka',
    };
  }

  // International fallback using timezone if available
  let tzCity = 'Current Location';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.includes('/')) {
      tzCity = tz.split('/')[1].replace(/_/g, ' ');
    }
  } catch {
    // ignore
  }

  return {
    displayName: tzCity !== 'Current Location' ? `${tzCity} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)` : `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
    city: tzCity,
    country: 'International',
  };
}
