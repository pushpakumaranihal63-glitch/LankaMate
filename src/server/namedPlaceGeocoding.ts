import { calculateDistanceKm, SRI_LANKA_BOUNDS } from '../utils/navigation';

export interface NamedSearchOrigin {
  lat: number;
  lng: number;
  displayName: string;
}

const normalizeName = (value: string) => value.normalize('NFKC').toLocaleLowerCase()
  .replace(/[\p{P}\p{Z}\s]/gu, '');
const AREA_TYPES = new Set(['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood',
  'quarter', 'municipality', 'district', 'borough', 'locality', 'administrative']);
// OSM currently names this village only "Sella Kataragama" (no Sinhala name).
// This spelling aid supplies no coordinates and is still verified by Nominatim.
const QUERY_ALIASES: Record<string, string> = {
  'සෙල්ලකතරගම': 'Sella Kataragama',
  'sellakataragama': 'Sella Kataragama',
};

/** Resolve an area only from matching Sri Lankan Nominatim records.
 * No coordinate defaults, AI-generated origins, or GPS fallback are used.
 */
export async function geocodeSriLankanLocation(location: string): Promise<NamedSearchOrigin | null> {
  const locationParts = location.split(',').map((part) => part.trim()).filter(Boolean);
  if (!locationParts.length) return null;
  locationParts[0] = QUERY_ALIASES[normalizeName(locationParts[0])] || locationParts[0];
  const queryLocation = locationParts.join(', ');
  const params = new URLSearchParams({
    q: `${queryLocation}, Sri Lanka`, countrycodes: 'lk', format: 'json',
    addressdetails: '1', namedetails: '1', limit: '10',
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LankaMate-Traveler-App/1.0 (contact: info@lankamate.lk)' },
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return null;
    const wanted = normalizeName(locationParts[0]);
    const matches: NamedSearchOrigin[] = [];
    for (const item of data) {
      if (!item || typeof item !== 'object') continue;
      const lat = Number.parseFloat(item.lat);
      const lng = Number.parseFloat(item.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
          lat < SRI_LANKA_BOUNDS.minLat || lat > SRI_LANKA_BOUNDS.maxLat ||
          lng < SRI_LANKA_BOUNDS.minLng || lng > SRI_LANKA_BOUNDS.maxLng ||
          item.address?.country_code?.toLowerCase() !== 'lk' ||
          !AREA_TYPES.has(item.addresstype || item.type)) continue;
      const names = [item.name, ...Object.values(item.namedetails || {}),
        ...(typeof item.display_name === 'string' ? [item.display_name.split(',')[0]] : [])]
        .filter((name): name is string => typeof name === 'string');
      // Permit alternative names explicitly supplied by OSM, but no fuzzy guesses.
      if (!names.some((name) => name.split(';').some((part) => normalizeName(part) === wanted))) continue;
      // Optional comma-separated district/province qualifiers disambiguate namesakes.
      // Every qualifier must match an actual returned address field.
      const addressNames = Object.values(item.address || {}).filter((value): value is string => typeof value === 'string')
        .flatMap((value) => [normalizeName(value), normalizeName(value.replace(/\s+(?:district|province|division)$/iu, ''))]);
      if (locationParts.slice(1).some((part) => !addressNames.includes(normalizeName(part)))) continue;
      if (typeof item.display_name !== 'string') continue;
      matches.push({ lat, lng, displayName: item.display_name });
    }
    if (!matches.length) return null;
    // Multiple representations of the same town are acceptable; distant namesakes are ambiguous.
    if (matches.some((match) => calculateDistanceKm(matches[0].lat, matches[0].lng, match.lat, match.lng) > 5)) return null;
    return matches[0];
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
