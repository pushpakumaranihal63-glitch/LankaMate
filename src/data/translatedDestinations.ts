import { Destination, LanguageCode } from '../types';
import { translateKey } from '../i18n';
import { destinationsPart1 } from './translations/destinationsPart1';
import { destinationsPart2 } from './translations/destinationsPart2';
import { destinationsPart3 } from './translations/destinationsPart3';
import { destinationsPart4 } from './translations/destinationsPart4';
import { destinationsBeaches } from './translations/destinationsBeaches';
import { destinationsEastAsiaPart1 } from './translations/destinationsEastAsiaPart1';
import { destinationsEastAsiaPart2 } from './translations/destinationsEastAsiaPart2';
import { destinationsEastAsiaPart3 } from './translations/destinationsEastAsiaPart3';
import { destinationsEastAsiaPart4 } from './translations/destinationsEastAsiaPart4';
import { destinationsEastAsiaBeaches } from './translations/destinationsEastAsiaBeaches';
import { destinationsEuropePart1 } from './translations/destinationsEuropePart1';
import { destinationsEuropePart2 } from './translations/destinationsEuropePart2';
import { destinationsEuropePart3 } from './translations/destinationsEuropePart3';
import { destinationsEuropePart4 } from './translations/destinationsEuropePart4';
import { destinationsEuropeBeaches } from './translations/destinationsEuropeBeaches';

export interface LocalizedDestinationFields {
  name: string;
  tagline: string;
  category: string;
  region: string;
  district: string;
  description: string;
  bestTimeToVisit: string;
  entryFee: string;
  travelTimeFromColombo: string;
  highlights: string[];
  activities: string[];
  travelTips: string[];
}

function mergeTranslations(
  ...sources: Record<string, Partial<Record<LanguageCode, LocalizedDestinationFields>>>[]
): Record<string, Partial<Record<LanguageCode, LocalizedDestinationFields>>> {
  const merged: Record<string, Partial<Record<LanguageCode, LocalizedDestinationFields>>> = {};
  for (const source of sources) {
    if (!source) continue;
    for (const [id, langs] of Object.entries(source)) {
      if (!merged[id]) {
        merged[id] = {};
      }
      Object.assign(merged[id], langs);
    }
  }
  return merged;
}

export const DESTINATION_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedDestinationFields>>> = mergeTranslations(
  destinationsPart1,
  destinationsPart2,
  destinationsPart3,
  destinationsPart4,
  destinationsBeaches,
  destinationsEastAsiaPart1,
  destinationsEastAsiaPart2,
  destinationsEastAsiaPart3,
  destinationsEastAsiaPart4,
  destinationsEastAsiaBeaches,
  destinationsEuropePart1,
  destinationsEuropePart2,
  destinationsEuropePart3,
  destinationsEuropePart4,
  destinationsEuropeBeaches,
);

/**
 * Localizes a destination object based on the currently selected language.
 * Falls back gracefully to English if translation is unavailable.
 */
export function getLocalizedDestination(dest: Destination | any, language: LanguageCode): Destination {
  if (!dest) {
    return dest;
  }

  if (language === 'en') {
    const enFields = DESTINATION_TRANSLATIONS[dest.id]?.en;
    if (enFields) {
      return {
        ...dest,
        name: enFields.name || dest.name,
        tagline: enFields.tagline || dest.tagline,
        category: (enFields.category || dest.category) as any,
        region: (enFields.region || dest.region) as any,
        district: enFields.district || dest.district,
        description: enFields.description || dest.description,
        bestTimeToVisit: enFields.bestTimeToVisit || dest.bestTimeToVisit,
        entryFee: enFields.entryFee || dest.entryFee,
        travelTimeFromColombo: enFields.travelTimeFromColombo || dest.travelTimeFromColombo,
        highlights: enFields.highlights && enFields.highlights.length > 0 ? enFields.highlights : dest.highlights,
        activities: enFields.activities && enFields.activities.length > 0 ? enFields.activities : dest.activities,
        travelTips: enFields.travelTips && enFields.travelTips.length > 0 ? enFields.travelTips : dest.travelTips,
      };
    }
    return dest;
  }

  const translatedFields = DESTINATION_TRANSLATIONS[dest.id]?.[language];
  const translatedCategory = translateKey(language, dest.category) || dest.category;
  const translatedRegion = translateKey(language, dest.region) || dest.region;
  const translatedCondition = translateKey(language, dest.weather?.condition) || dest.weather?.condition;

  if (!translatedFields) {
    return {
      ...dest,
      category: translatedCategory as any,
      region: translatedRegion as any,
      weather: dest.weather ? { ...dest.weather, condition: translatedCondition } : dest.weather,
    };
  }

  return {
    ...dest,
    name: translatedFields.name || dest.name,
    tagline: translatedFields.tagline || dest.tagline,
    category: (translatedFields.category || translatedCategory) as any,
    region: (translatedFields.region || translatedRegion) as any,
    district: translatedFields.district || dest.district,
    description: translatedFields.description || dest.description,
    bestTimeToVisit: translatedFields.bestTimeToVisit || dest.bestTimeToVisit,
    entryFee: translatedFields.entryFee || dest.entryFee,
    travelTimeFromColombo: translatedFields.travelTimeFromColombo || dest.travelTimeFromColombo,
    highlights: translatedFields.highlights && translatedFields.highlights.length > 0 ? translatedFields.highlights : dest.highlights,
    activities: translatedFields.activities && translatedFields.activities.length > 0 ? translatedFields.activities : dest.activities,
    travelTips: translatedFields.travelTips && translatedFields.travelTips.length > 0 ? translatedFields.travelTips : dest.travelTips,
    weather: dest.weather ? { ...dest.weather, condition: translatedCondition } : dest.weather,
  };
}

/**
 * Returns all destinations localized for the active language.
 */
export function getLocalizedDestinations(destinations: Destination[], language: LanguageCode): Destination[] {
  if (!destinations) return [];
  if (language === 'en') {
    return destinations.map((d) => getLocalizedDestination(d, 'en'));
  }
  return destinations.map((d) => getLocalizedDestination(d, language));
}
