import { randomUUID } from 'node:crypto';
import { detectPlaceFollowup } from '../utils/placeFollowupIntent';
import { getGoogleMapsDirectionsUrl } from '../utils/navigation';
import type { VerifiedPlaceSearch } from '../utils/verifiedPlaceResults';

/** Server-owned records only. The client sends an opaque token, never trusted
 * coordinates or a Gemini transcript. Context expires after 30 minutes. */
export function createVerifiedPlaceContextStore() {
  const entries = new Map<string, { search: VerifiedPlaceSearch; expires: number; selected?: number }>();
  const prune = () => { for (const [token, entry] of entries) if (entry.expires < Date.now()) entries.delete(token); };
  return {
    remember(search: VerifiedPlaceSearch): string | undefined {
      prune();
      if (search.status !== 'results' || !search.places.length) return undefined;
      if (entries.size >= 500) entries.delete(entries.keys().next().value!);
      const token = randomUUID();
      entries.set(token, { search: structuredClone(search), expires: Date.now() + 30 * 60 * 1000 });
      return token;
    },
    followup(token: unknown, message: string): VerifiedPlaceSearch | null {
      prune();
      if (typeof token !== 'string') return detectPlaceFollowup(message, []) ? { status: 'context_unavailable', places: [] } : null;
      const entry = entries.get(token);
      if (!entry) return { status: 'context_unavailable', places: [] };
      const intent = detectPlaceFollowup(message, entry?.search.places || []);
      if (!intent) return null;
      const selected = intent.selectedIndex ?? entry.selected ?? (entry.search.places.length === 1 ? 0 : undefined);
      if (selected === undefined || !entry.search.places[selected]) return {
        ...entry.search, presentation: 'choose',
        places: entry.search.places.map((place) => ({ ...place, mapsUrl: getGoogleMapsDirectionsUrl(place.latitude, place.longitude) })),
      };
      entry.selected = selected;
      const place = entry.search.places[selected];
      return { ...entry.search, ...(intent.kind === 'details' ? { presentation: 'details' as const } : {}),
        places: [{ ...place, mapsUrl: getGoogleMapsDirectionsUrl(place.latitude, place.longitude) }] };
    },
  };
}
