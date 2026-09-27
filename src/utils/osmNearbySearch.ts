// OpenStreetMap-Compatible Nearby Places Search Utility for LankaMate
// Integrates with Nominatim/OSM search infrastructure using real device GPS coordinates as origin.

import { NearMeCategory, NearMePlace } from '../data/nearMeData';
import { calculateDistanceKm } from './locationHelper';

interface OsmSearchResult {
  place_id: number;
  osm_id: number;
  osm_type: string;
  lat: string;
  lon: string;
  display_name: string;
  class?: string;
  type?: string;
  name?: string;
  address?: {
    amenity?: string;
    tourism?: string;
    shop?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

// Category search configurations matching exact place types requested
export const CATEGORY_OSM_SEARCH_CONFIG: Record<
  NearMeCategory,
  {
    searchQueries: string[];
    categoryLabel: string;
    defaultServices: string[];
  }
> = {
  fuel: {
    searchQueries: ['fuel station', 'petrol station', 'filling station', 'ceypetco', 'lanka ioc'],
    categoryLabel: 'Fuel Station',
    defaultServices: ['Petrol 92', 'Auto Diesel', 'Tire Pressure Air'],
  },
  hotel: {
    searchQueries: ['hotel', 'resort', 'guest house', 'homestay'],
    categoryLabel: 'Hotel',
    defaultServices: ['Room Accommodation', 'Hot Water', 'WiFi'],
  },
  bank: {
    searchQueries: ['bank', 'atm'],
    categoryLabel: 'Bank & ATM',
    defaultServices: ['Cash ATM', 'Currency Exchange', 'Banking Services'],
  },
  restaurant: {
    searchQueries: ['restaurant', 'cafe', 'food places'],
    categoryLabel: 'Restaurant',
    defaultServices: ['Sri Lankan Cuisine', 'Tea & Coffee', 'Dine-in / Takeaway'],
  },
  pharmacy: {
    searchQueries: ['pharmacy', 'drug store'],
    categoryLabel: 'Pharmacy',
    defaultServices: ['Prescription Medicines', 'First Aid Supplies', 'Travel Wellness'],
  },
  supermarket: {
    searchQueries: ['supermarket', 'grocery store'],
    categoryLabel: 'Supermarket',
    defaultServices: ['Mineral Water', 'Fresh Snacks', 'Toiletries & Essentials'],
  },
  car_service: {
    searchQueries: ['car repair', 'vehicle service', 'tyre service', 'roadside assistance'],
    categoryLabel: 'Car Service',
    defaultServices: ['Emergency Mechanical Repair', 'Puncture Works', 'Battery Care'],
  },
  attraction: {
    searchQueries: ['tourist attraction', 'viewpoint', 'waterfall', 'landmark', 'park'],
    categoryLabel: 'Tourist Attraction',
    defaultServices: ['Scenic Sightseeing', 'Photography Point', 'Hiking Trail'],
  },
  hospital: {
    searchQueries: ['hospital', 'clinic', 'medical center'],
    categoryLabel: 'Hospital',
    defaultServices: ['Emergency Trauma Unit', 'Doctor Consultations', 'First Aid'],
  },
};

// In-memory cache to prevent redundant network queries for the same coordinates and category
const osmCache = new Map<string, NearMePlace[]>();

/**
 * Searches nearby real places from OpenStreetMap Nominatim around user's GPS coordinates.
 */
export async function fetchNearbyOsmPlaces(
  category: NearMeCategory,
  userLat: number,
  userLng: number,
  radiusKm: number = 25
): Promise<NearMePlace[]> {
  const cacheKey = `${category}_${userLat.toFixed(3)}_${userLng.toFixed(3)}_${radiusKm}`;
  if (osmCache.has(cacheKey)) {
    return osmCache.get(cacheKey)!;
  }

  const config = CATEGORY_OSM_SEARCH_CONFIG[category];
  if (!config) return [];

  // Search with an effective radius of at least 25km so 5km, 10km, and 25km filters have full geographic data
  const effectiveRadius = Math.max(radiusKm, 25);
  const degDelta = Math.max(0.08, (effectiveRadius / 111) * 1.3);
  const minLat = (userLat - degDelta).toFixed(5);
  const maxLat = (userLat + degDelta).toFixed(5);
  const minLng = (userLng - degDelta).toFixed(5);
  const maxLng = (userLng + degDelta).toFixed(5);
  const viewbox = `${minLng},${maxLat},${maxLng},${minLat}`;

  let rawItems: OsmSearchResult[] = [];

  // Attempt 1: Fetch via local Express server proxy (CORS-safe, country-bounded to Sri Lanka, multi-query aggregated)
  try {
    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
    const proxyUrl = `${baseUrl}/api/places/nearby?category=${encodeURIComponent(
      category
    )}&lat=${userLat}&lng=${userLng}&radius=${effectiveRadius}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (Array.isArray(json.places) && json.places.length > 0) {
        rawItems = json.places;
      }
    }
  } catch {
    // Fall back to direct OpenStreetMap fetch if proxy is unavailable
  }

  // Attempt 2: Direct Nominatim fetch if server proxy returned empty
  if (rawItems.length === 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const queriesToTry = config.searchQueries.slice(0, 2);
      const fallbackPromises = queriesToTry.map(async (queryTerm) => {
        const directUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          queryTerm
        )}&viewbox=${viewbox}&bounded=1&countrycodes=lk&limit=50`;

        const res = await fetch(directUrl, {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en',
          },
        });

        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? (data as OsmSearchResult[]) : [];
      });

      const settledFallback = await Promise.allSettled(fallbackPromises);
      clearTimeout(timeoutId);

      for (const item of settledFallback) {
        if (item.status === 'fulfilled') {
          rawItems.push(...item.value);
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    const seenIds = new Set<string | number>();
    const seenLocations = new Set<string>();
    const results: NearMePlace[] = [];

    for (const item of rawItems) {
      const uniqueId = item.place_id || item.osm_id;
      if (uniqueId && seenIds.has(uniqueId)) continue;
      if (uniqueId) seenIds.add(uniqueId);

      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      if (isNaN(lat) || isNaN(lng)) continue;

      // Proximity deduplication within ~40 meters
      const locKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
      if (seenLocations.has(locKey)) continue;
      seenLocations.add(locKey);

      const rawParts = item.display_name.split(',');
      const placeName = rawParts[0].trim();
      const addr = item.address || {};
      const city = addr.town || addr.city || addr.village || addr.suburb || rawParts[1]?.trim() || 'Nearby';
      const area = addr.road || addr.county || addr.suburb || 'Local Area';

      // Format clean place name or assign category + area if unnamed in OSM
      let resolvedName = placeName;
      if (!resolvedName || resolvedName.toLowerCase() === category || resolvedName.length < 3) {
        resolvedName = area !== 'Local Area' ? `${config.categoryLabel} (${area})` : `${config.categoryLabel} (${city})`;
      }

      // Determine specific label for hotels/restaurants
      let specificLabel = config.categoryLabel;
      if (category === 'hotel') {
        const lowerName = placeName.toLowerCase();
        const lowerType = (item.type || '').toLowerCase();
        if (lowerName.includes('resort') || lowerType === 'resort') {
          specificLabel = 'Resort';
        } else if (
          lowerName.includes('guest house') ||
          lowerName.includes('guesthouse') ||
          lowerType === 'guest_house'
        ) {
          specificLabel = 'Guest House';
        } else if (lowerName.includes('homestay') || lowerType === 'homestay') {
          specificLabel = 'Homestay';
        } else if (lowerName.includes('villa') || lowerType === 'villa') {
          specificLabel = 'Villa';
        } else {
          specificLabel = 'Hotel';
        }
      } else if (category === 'restaurant') {
        const lowerName = placeName.toLowerCase();
        if (lowerName.includes('cafe') || lowerName.includes('coffee')) {
          specificLabel = 'Cafe & Dining';
        } else {
          specificLabel = 'Restaurant';
        }
      }

      results.push({
        id: `osm-${category}-${uniqueId}`,
        name: resolvedName,
        category,
        categoryLabel: specificLabel,
        city,
        area,
        address: item.display_name,
        coordinates: { lat, lng },
        openStatus: 'Open Now',
        openingHours: 'Regular Hours',
        services: config.defaultServices,
        description: `Verified ${specificLabel.toLowerCase()} in ${city}, located via OpenStreetMap Sri Lanka infrastructure.`,
        drivingTip: `Accessible from ${area}. Follow Google Maps turn-by-turn navigation.`,
      });
    }

    // Sort results nearest first by distance from user coordinates
    results.sort((a, b) => {
      const distA = calculateDistanceKm(userLat, userLng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistanceKm(userLat, userLng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });

    osmCache.set(cacheKey, results);
    return results;
  } catch {
    return [];
  }
}
