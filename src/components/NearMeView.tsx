import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  LocateFixed,
  Fuel,
  Hotel,
  Building2,
  Utensils,
  Activity,
  Pill,
  ShoppingCart,
  Wrench,
  Clock,
  Phone,
  CheckCircle2,
  X,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Info,
  ChevronRight,
  Compass,
  AlertTriangle,
  Car,
  ShieldCheck,
  Map as MapIcon,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import {
  NearMePlace,
  NearMeCategory,
  NEAR_ME_CATEGORIES,
  nearMePlacesData,
} from '../data/nearMeData';
import { SRI_LANKAN_ACCOMMODATIONS } from '../data/accommodationsData';
import { fetchNearbyOsmPlaces } from '../utils/osmNearbySearch';
import {
  openGoogleMapsSearch,
  requestUserLocation,
  calculateDistanceKm,
  formatDistanceKm,
  Coordinates,
  SRI_LANKA_DEFAULT_CENTER,
} from '../utils/navigation';
import { PageId } from '../types';
import { handleEmergencyCall } from '../utils/emergencyCall';
import { useTranslation } from '../i18n/LanguageContext';

interface NearMeViewProps {
  onNavigatePage: (page: PageId) => void;
}

const CURATED_HOTEL_IDS = new Set(SRI_LANKAN_ACCOMMODATIONS.map((hotel) => hotel.id));

const GPS_SESSION_STORAGE_KEY = 'lankamate_detected_user_gps';

interface StoredGpsState {
  coordinates: Coordinates;
  isRealGps: boolean;
  accuracy: number | null;
  detectedAreaName: string | null;
  isUsingFallback: boolean;
}

export const CATEGORY_TITLES: Record<NearMeCategory | 'all', string> = {
  all: 'All Useful Places',
  fuel: 'Nearby Fuel Stations',
  hotel: 'Nearby Hotels',
  bank: 'Nearby Banks & ATMs',
  restaurant: 'Nearby Restaurants',
  hospital: 'Nearby Hospitals',
  pharmacy: 'Nearby Pharmacies',
  supermarket: 'Nearby Supermarkets',
  car_service: 'Nearby Car Services',
  attraction: 'Nearby Tourist Attractions',
};

export const CATEGORY_NAMES: Record<NearMeCategory | 'all', string> = {
  all: 'places',
  fuel: 'Fuel Stations',
  hotel: 'Hotels',
  bank: 'Banks & ATMs',
  restaurant: 'Restaurants',
  hospital: 'Hospitals',
  pharmacy: 'Pharmacies',
  supermarket: 'Supermarkets',
  car_service: 'Car Services',
  attraction: 'Tourist Attractions',
};

export const NearMeView: React.FC<NearMeViewProps> = ({ onNavigatePage }) => {
  const { t } = useTranslation();
  const CATEGORY_TITLES_T: Record<NearMeCategory | 'all', string> = {
    all: t('All Useful Places'),
    fuel: t('Nearby Fuel Stations'),
    hotel: t('Nearby Hotels'),
    bank: t('Nearby Banks & ATMs'),
    restaurant: t('Nearby Restaurants'),
    hospital: t('Nearby Hospitals'),
    pharmacy: t('Nearby Pharmacies'),
    supermarket: t('Nearby Supermarkets'),
    car_service: t('Nearby Car Services'),
    attraction: t('Nearby Tourist Attractions'),
  };
  const CATEGORY_NAMES_T: Record<NearMeCategory | 'all', string> = {
    all: t('places'),
    fuel: t('Fuel Stations'),
    hotel: t('Hotels'),
    bank: t('Banks & ATMs'),
    restaurant: t('Restaurants'),
    hospital: t('Hospitals'),
    pharmacy: t('Pharmacies'),
    supermarket: t('Supermarkets'),
    car_service: t('Car Services'),
    attraction: t('Tourist Attractions'),
  };
  const [activeCategory, setActiveCategory] = useState<NearMeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize location from sessionStorage ONLY if the user already detected genuine REAL GPS during this session
  const [userLocation, setUserLocation] = useState<Coordinates | null>(() => {
    try {
      const saved = sessionStorage.getItem(GPS_SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: StoredGpsState = JSON.parse(saved);
        if (
          parsed.isRealGps === true &&
          parsed.coordinates &&
          typeof parsed.coordinates.lat === 'number' &&
          typeof parsed.coordinates.lng === 'number'
        ) {
          return parsed.coordinates;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isRealGps, setIsRealGps] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem(GPS_SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: StoredGpsState = JSON.parse(saved);
        return Boolean(parsed.isRealGps);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(() => {
    try {
      const saved = sessionStorage.getItem(GPS_SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: StoredGpsState = JSON.parse(saved);
        return parsed.isRealGps ? parsed.accuracy ?? null : null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [detectedAreaName, setDetectedAreaName] = useState<string | null>(() => {
    try {
      const saved = sessionStorage.getItem(GPS_SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: StoredGpsState = JSON.parse(saved);
        return parsed.isRealGps ? parsed.detectedAreaName ?? null : null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Never automatically initialize in fallback mode (Requirement 5)
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationErrorCode, setLocationErrorCode] = useState<number | null>(null);
  const [locationErrorName, setLocationErrorName] = useState<string | null>(null);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<NearMePlace | null>(null);
  const [distanceRadius, setDistanceRadius] = useState<'all' | '5' | '10' | '25'>('all');

  // Handle "Use My Location" - detects device hardware GPS
  const handleUseMyLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    setLocationErrorCode(null);
    setLocationErrorName(null);
    setIsUsingFallback(false);

    const result = await requestUserLocation();
    setIsLocating(false);

    if (result.coordinates && result.isRealGps) {
      setUserLocation(result.coordinates);
      setIsRealGps(true);
      setIsUsingFallback(false);
      setLocationAccuracy(result.accuracy ?? null);
      setDetectedAreaName(result.nearestHubName || null);
      setLocationError(null);
      setLocationErrorCode(null);
      setLocationErrorName(null);

      // Persist real detected GPS so every category view inherits these coordinates
      try {
        const toSave: StoredGpsState = {
          coordinates: result.coordinates,
          isRealGps: true,
          accuracy: result.accuracy ?? null,
          detectedAreaName: result.nearestHubName || null,
          isUsingFallback: false,
        };
        sessionStorage.setItem(GPS_SESSION_STORAGE_KEY, JSON.stringify(toSave));
      } catch {
        // ignore
      }

      if (!result.isInsideSriLanka) {
        setLocationError(
          t('Detected location') + ` (${result.coordinates.lat.toFixed(5)}°, ${result.coordinates.lng.toFixed(5)}°) ` + t('is outside Sri Lanka. Distances are calculated from your real location.')
        );
      }
    } else {
      // Real GPS could not be obtained - do NOT automatically set Colombo Central (Requirements 5 & 8)
      setUserLocation(null);
      setIsRealGps(false);
      setIsUsingFallback(false);
      setLocationAccuracy(null);
      setDetectedAreaName(null);
      try {
        sessionStorage.removeItem(GPS_SESSION_STORAGE_KEY);
      } catch {
        // ignore
      }
      setLocationError(
        result.error || t('Failed to acquire GPS location. Please check your device location settings.')
      );
      setLocationErrorCode(result.errorCode ?? null);
      setLocationErrorName(result.errorName ?? null);
    }
  };

  // Explicit Colombo Central fallback - ONLY when real device GPS genuinely cannot be obtained
  const handleUseColomboFallback = () => {
    setUserLocation(SRI_LANKA_DEFAULT_CENTER);
    setIsRealGps(false);
    setIsUsingFallback(true);
    setLocationAccuracy(null);
    setDetectedAreaName(t('Colombo Central (Fallback Reference)'));
    setLocationError(null);
    setLocationErrorCode(null);
    setLocationErrorName(null);
    // Never persist manual fallback reference to sessionStorage (Requirement 5)
    try {
      sessionStorage.removeItem(GPS_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Explicitly clear GPS location
  const handleClearGps = () => {
    setUserLocation(null);
    setIsRealGps(false);
    setIsUsingFallback(false);
    setDetectedAreaName(null);
    setLocationAccuracy(null);
    setLocationError(null);
    setLocationErrorCode(null);
    setLocationErrorName(null);
    try {
      sessionStorage.removeItem(GPS_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const [dynamicOsmPlaces, setDynamicOsmPlaces] = useState<NearMePlace[]>([]);
  const [, setIsSearchingOsm] = useState(false);

  // When real GPS or category changes, optionally fetch supplementary OpenStreetMap places around user GPS
  useEffect(() => {
    if (!userLocation || activeCategory === 'all') {
      setDynamicOsmPlaces([]);
      return;
    }

    let isMounted = true;
    const radiusNumber = distanceRadius === 'all' ? 25 : parseFloat(distanceRadius);

    setIsSearchingOsm(true);
    fetchNearbyOsmPlaces(activeCategory, userLocation.lat, userLocation.lng, radiusNumber)
      .then((osmResults) => {
        if (!isMounted) return;
        // Strictly filter to ensure any OSM result matches activeCategory
        const validOsm = osmResults.filter((p) => p.category === activeCategory);
        setDynamicOsmPlaces(validOsm);
        setIsSearchingOsm(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsSearchingOsm(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userLocation?.lat, userLocation?.lng, activeCategory, distanceRadius]);

  // Combined place list: static curated places + dynamic OpenStreetMap places
  const allPlaces = useMemo(() => {
    if (dynamicOsmPlaces.length === 0) {
      return nearMePlacesData;
    }
    const combined = [...nearMePlacesData];
    for (const dPlace of dynamicOsmPlaces) {
      if (dPlace.category !== activeCategory) continue;
      const alreadyExists = combined.some((c) => {
        if (c.category !== dPlace.category) return false;
        const nameMatch = c.name.toLowerCase().trim() === dPlace.name.toLowerCase().trim();
        const distMeters =
          calculateDistanceKm(
            c.coordinates.lat,
            c.coordinates.lng,
            dPlace.coordinates.lat,
            dPlace.coordinates.lng
          ) * 1000;
        return nameMatch || distMeters < 80;
      });
      if (!alreadyExists) {
        combined.push(dPlace);
      }
    }
    return combined;
  }, [dynamicOsmPlaces, activeCategory]);

  // Compute distance for all places based on user location (or Colombo reference point if requested)
  const placesWithDistance = useMemo(() => {
    return allPlaces.map((place) => {
      let distanceKm: number | null = null;
      if (userLocation) {
        distanceKm = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          place.coordinates.lat,
          place.coordinates.lng
        );
      }
      return {
        ...place,
        distanceKm,
      };
    });
  }, [allPlaces, userLocation]);

  // Filter and sort places by category, radius, and distance
  const filteredPlaces = useMemo(() => {
    let list = placesWithDistance.filter((place) => {
      // 1. Strict Category filter: only include places matching activeCategory (unless activeCategory is 'all')
      if (activeCategory !== 'all' && place.category !== activeCategory) {
        return false;
      }

      // 2. Distance radius filter (if user location is active)
      if (userLocation && distanceRadius !== 'all') {
        if (place.distanceKm === null) {
          return false;
        }
        const radiusNum = parseFloat(distanceRadius);
        if (place.distanceKm > radiusNum) {
          return false;
        }
      }

      // 3. Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesCity = place.city.toLowerCase().includes(query);
        const matchesArea = place.area.toLowerCase().includes(query);
        const matchesAddress = place.address.toLowerCase().includes(query);
        const matchesCategory = place.categoryLabel.toLowerCase().includes(query);
        const matchesKeywords = place.searchKeywords?.toLowerCase().includes(query) || false;
        const matchesServices = place.services.some((s) => s.toLowerCase().includes(query));

        return (
          matchesName ||
          matchesCity ||
          matchesArea ||
          matchesAddress ||
          matchesCategory ||
          matchesKeywords ||
          matchesServices
        );
      }

      return true;
    });

    // 4. Sort: if user location is available, sort category results from nearest to farthest
    if (userLocation) {
      list = [...list].sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return list;
  }, [placesWithDistance, activeCategory, searchQuery, userLocation, distanceRadius]);

  const handleCategorySelect = (categoryId: NearMeCategory) => {
    setActiveCategory(categoryId);
    setDynamicOsmPlaces([]);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setDistanceRadius('all');
    setDynamicOsmPlaces([]);
    // Note: Do NOT reset userLocation - preserve user's detected GPS coordinates!
  };

  // Helper icon renderer for categories
  const getCategoryIcon = (catId: NearMeCategory, className = 'w-5 h-5') => {
    switch (catId) {
      case 'fuel':
        return <Fuel className={className} />;
      case 'hotel':
        return <Hotel className={className} />;
      case 'bank':
        return <Building2 className={className} />;
      case 'restaurant':
        return <Utensils className={className} />;
      case 'hospital':
        return <Activity className={className} />;
      case 'pharmacy':
        return <Pill className={className} />;
      case 'supermarket':
        return <ShoppingCart className={className} />;
      case 'car_service':
        return <Wrench className={className} />;
      case 'attraction':
        return <MapPin className={className} />;
      default:
        return <MapPin className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0c2340] via-blue-900 to-[#0c2340] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-blue-950/20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700/80 text-sky-200 text-xs font-bold tracking-wide">
              <Compass className="w-3.5 h-3.5 text-sky-300" />
              <span>{t('Smart GPS & Route Navigation')}</span>
            </div>

            {/* Disclaimer badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
              <Info className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('Reference Information')}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <MapPin className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 shrink-0" />
              {t('Near Me')}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium mt-2 leading-relaxed max-w-2xl">
              {t('Find useful places around your current location')}
            </p>
          </div>

          {/* Quick Notice about Data Integrity & Google Maps Handover */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 flex items-start gap-3 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">{t('Live Navigation Handover:')}</strong> {t('Tap')}{' '}
              <span className="font-bold text-amber-300">{t('Navigate')}</span> {t('on any place to launch')}
              {t('Google Maps to confirm the destination before choosing Directions. Static directory')}
              {t('operating hours are labeled as reference information.')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Controls Card: Search & Location */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-stone-200/90 space-y-5">
          {/* Row 1: Search a Place or Destination & Use My Location */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="near-me-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search a place, city, landmark, hotel, fuel station, bank, hospital...')}
                className="w-full pl-11 pr-10 py-3 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-2xl text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  id="btn-clear-nearme-search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-full cursor-pointer"
                  title={t('Clear search text')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Use My Location Button */}
            <div className="md:col-span-4 flex items-center gap-2">
              <button
                type="button"
                id="btn-use-my-location"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-stone-300 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <LocateFixed
                  className={`w-4 h-4 text-emerald-200 ${isLocating ? 'animate-spin' : ''}`}
                />
                <span>{isLocating ? t('Acquiring GPS...') : t('Use My Location')}</span>
              </button>

              {(searchQuery || activeCategory !== 'all' || distanceRadius !== 'all' || userLocation) && (
                <button
                  type="button"
                  id="btn-reset-nearme-filters"
                  onClick={handleResetFilters}
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl transition-colors cursor-pointer shrink-0"
                  title={t('Reset All Filters')}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Location Status Notice (Dynamic) */}
          {isLocating && (
            <div
              id="near-me-location-status"
              className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs sm:text-sm flex items-center gap-3 shadow-2xs"
            >
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <span className="font-bold text-blue-900 block">{t('Acquiring device GPS location...')}</span>
                <span className="text-xs text-blue-800">
                  {t('Requesting location from your device. If prompted by your browser or phone system, please tap “Allow while using app”.')}
                </span>
              </div>
            </div>
          )}

          {/* Real GPS Location Detected */}
          {!isLocating && userLocation && isRealGps && (
            <div
              id="near-me-location-status"
              className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm space-y-2 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('Real Device GPS Active')}</span>
                  {detectedAreaName && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-200/80 text-emerald-950 font-bold text-[11px]">
                      {detectedAreaName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-refresh-gps"
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t('Refresh GPS')}</span>
                  </button>
                  <button
                    type="button"
                    id="btn-clear-gps"
                    onClick={handleClearGps}
                    className="text-[11px] font-bold text-stone-500 hover:text-stone-800 cursor-pointer ml-1"
                  >
                    {t('Clear')}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-900">
                <div className="flex items-center gap-1 font-mono font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {userLocation.lat.toFixed(5)}° N, {userLocation.lng.toFixed(5)}° E
                  </span>
                </div>

                {locationAccuracy !== null && (
                  <span className="text-emerald-800 font-medium">
                    {t('Accuracy:')} ±{locationAccuracy} m
                  </span>
                )}

                <span className="text-emerald-700 font-medium">
                  • {t('Distances & sorting calculated using actual device coordinates')}
                </span>
              </div>

              {locationError && (
                <div className="text-[11px] text-amber-800 bg-amber-100/70 p-2 rounded-xl mt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>
          )}

          {/* Colombo Central Fallback in Use */}
          {!isLocating && userLocation && isUsingFallback && (
            <div
              id="near-me-location-status"
              className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('Reference Point Active: Colombo Central')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-retry-real-gps"
                    onClick={handleUseMyLocation}
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <LocateFixed className="w-3 h-3" />
                    <span>{t('Try Real GPS')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearGps}
                    className="text-[11px] font-bold text-stone-500 hover:text-stone-800 cursor-pointer ml-1"
                  >
                    {t('Clear')}
                  </button>
                </div>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {t('Measuring distances from Colombo Central')} ({SRI_LANKA_DEFAULT_CENTER.lat.toFixed(4)}°, {SRI_LANKA_DEFAULT_CENTER.lng.toFixed(4)}°) {t('as manual fallback. Tap “Try Real GPS” to use your device’s actual location.')}
              </p>
            </div>
          )}

          {/* Error Notice when GPS Failed / Denied / Timed Out (Requirements 5, 7, 8) */}
          {!isLocating && !userLocation && locationError && (
            <div
              id="near-me-location-status"
              className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm space-y-3 shadow-2xs"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-rose-900 block">
                    {locationErrorCode === 1 ? t('Location Permission Denied') : t('GPS Acquisition Issue')}
                  </span>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {locationError}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-100">
                <button
                  type="button"
                  id="btn-retry-gps"
                  onClick={handleUseMyLocation}
                  className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('Retry GPS')}</span>
                </button>
                <button
                  type="button"
                  id="btn-fallback-colombo"
                  onClick={handleUseColomboFallback}
                  className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs touch-manipulation"
                >
                  <Compass className="w-3.5 h-3.5 text-stone-600" />
                  <span>{t('Use Colombo Central Reference Fallback')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Useful GPS Diagnostic Information Panel during testing (Requirement 15) */}
          <div
            id="gps-diagnostics-panel"
            className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/90 text-stone-800 text-xs space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Compass className="w-4 h-4 text-blue-900 shrink-0" />
                <span>{t('GPS Diagnostic Information')}</span>
              </div>
              <span
                id="diag-gps-status-badge"
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  isLocating
                    ? 'bg-blue-100 text-blue-900 animate-pulse'
                    : isRealGps
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : isUsingFallback
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : locationErrorCode === 1
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : locationErrorCode === 3
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : locationError
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {isLocating
                  ? 'ACQUIRING'
                  : isRealGps
                  ? 'REAL_GPS_ACTIVE'
                  : isUsingFallback
                  ? 'COLOMBO_FALLBACK'
                  : locationErrorCode === 1
                  ? 'PERMISSION_DENIED'
                  : locationErrorCode === 3
                  ? 'TIMEOUT'
                  : locationError
                  ? 'ERROR'
                  : 'IDLE'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('GPS Status')}</span>
                <span id="diag-gps-status" className="font-semibold text-stone-900 text-xs block mt-0.5 truncate">
                  {isLocating
                    ? t('Acquiring device GPS...')
                    : isRealGps
                    ? t('Real Hardware GPS')
                    : isUsingFallback
                    ? t('Colombo Fallback')
                    : locationErrorCode === 1
                    ? t('Permission Denied')
                    : locationErrorCode === 3
                    ? t('Request Timed Out')
                    : locationError
                    ? t('Failed')
                    : t('Not requested')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('Latitude')}</span>
                <span id="diag-gps-latitude" className="font-mono font-semibold text-stone-900 text-xs block mt-0.5">
                  {userLocation ? `${userLocation.lat.toFixed(6)}° N` : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('Longitude')}</span>
                <span id="diag-gps-longitude" className="font-mono font-semibold text-stone-900 text-xs block mt-0.5">
                  {userLocation ? `${userLocation.lng.toFixed(6)}° E` : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('Accuracy')}</span>
                <span id="diag-gps-accuracy" className="font-mono font-semibold text-stone-900 text-xs block mt-0.5">
                  {locationAccuracy !== null
                    ? `±${locationAccuracy} m`
                    : isUsingFallback
                    ? t('Reference Point')
                    : '—'}
                </span>
              </div>
            </div>

            {/* Error Message & Code display when geolocation fails */}
            {locationError && (
              <div
                id="diag-gps-error"
                className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">
                    {locationErrorCode ? `${t('Error Code')} ${locationErrorCode} (${locationErrorName || 'ERROR'})` : t('Error')}:
                  </div>
                  <div className="leading-relaxed font-medium">{locationError}</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
              <div className="flex items-center gap-3">
                <span>
                  {t('Context:')}{' '}
                  <strong className="text-stone-700">
                    {typeof window !== 'undefined' && window.isSecureContext ? t('HTTPS (Secure)') : t('HTTP / Insecure')}
                  </strong>
                </span>
                <span>
                  {t('Sensor API:')}{' '}
                  <strong className="text-stone-700">
                    {typeof navigator !== 'undefined' && !!navigator.geolocation ? t('Available') : t('Unavailable')}
                  </strong>
                </span>
              </div>

              {!isUsingFallback && (
                <button
                  type="button"
                  id="btn-manual-colombo-fallback"
                  onClick={handleUseColomboFallback}
                  className="text-stone-600 hover:text-blue-900 font-semibold underline cursor-pointer"
                >
                  {t('Use Colombo Central Reference Fallback')}
                </button>
              )}
            </div>
          </div>

          {/* Distance Radius Filter (Available when location is acquired) */}
          {userLocation && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-600 mr-1 flex items-center gap-1">
                <LocateFixed className="w-3.5 h-3.5 text-emerald-600" />
                {t('Distance Radius:')}
              </span>
              {(['all', '5', '10', '25'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  id={`btn-radius-${r}`}
                  onClick={() => setDistanceRadius(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    distanceRadius === r
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {r === 'all' ? t('All Island') : `${t('Within')} ${r} km`}
                </button>
              ))}
            </div>
          )}

          {/* Category Cards Section */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider">
                {t('Browse Useful Places by Category')}
              </h2>
              {activeCategory !== 'all' && (
                <button
                  type="button"
                  id="btn-show-all-categories"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs text-blue-800 font-bold hover:underline cursor-pointer"
                >
                  {t('Show All Categories')}
                </button>
              )}
            </div>

            {/* 9 Category Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
              {NEAR_ME_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`btn-category-${cat.id}`}
                    data-category={cat.id}
                    data-active={isActive}
                    aria-label={t(cat.label)}
                    aria-pressed={isActive}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer touch-manipulation group ${
                      isActive
                        ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/30 font-bold'
                        : 'bg-stone-50/80 hover:bg-white border-stone-200/90 text-stone-800 hover:shadow-sm hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.emoji}</span>
                    <span className="text-xs font-bold tracking-tight line-clamp-1">
                      {t(cat.label)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Driving Around Sri Lanka - Self-Driving Tourist Support Card */}
        <section
          id="driving-around-sri-lanka-section"
          className="mt-8 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-7 text-white border border-stone-700/60 shadow-md space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {t('Self-Driving & Road Trip Advisory')}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {t('Driving Around Sri Lanka')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigatePage('fuel')}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>{t('Dedicated Fuel Finder')}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage('map')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/20"
              >
                <MapIcon className="w-3.5 h-3.5 text-sky-300" />
                <span>{t('Interactive Island Map')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Fuel className="w-4 h-4" />
                <span>{t('Keep Fuel Topped Up')}</span>
              </div>
              <p className="leading-relaxed">
                {t('Refuel before long rural stretches, mountain ascents (Kandy to Nuwara Eliya/Ella), and national park gateways. Stations are 20–35 km apart in hill terrain.')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-300 font-bold">
                <Compass className="w-4 h-4" />
                <span>{t('Check Remote Routes')}</span>
              </div>
              <p className="leading-relaxed">
                {t('Pre-download offline maps before entering cloud forest corridors or deep wildlife sanctuaries where cellular coverage can dip.')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>{t('Emergency Hotlines')}</span>
              </div>
              <p className="leading-relaxed">
                {t('Free ambulance:')} <strong className="text-white">1990</strong> • {t('Police:')}{' '}
                <strong className="text-white">119</strong> • {t('Tourist Police:')}{' '}
                <strong className="text-white">1912</strong> • {t('Expressway Breakdown:')}{' '}
                <strong className="text-white">1969</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('Local Traffic Rules')}</span>
              </div>
              <p className="leading-relaxed">
                {t('Drive strictly on the')} <strong className="text-white">{t('left side')}</strong>. {t('Give way to oncoming traffic on steep single-lane climbs and strictly yield to pedestrians at zebra crossings.')}
              </p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="near-me-results-section" className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2
                id="near-me-selected-category-title"
                data-testid="selected-category-title"
                data-category={activeCategory}
                className="text-xl font-black text-stone-900 tracking-tight"
              >
                {CATEGORY_TITLES_T[activeCategory]}
              </h2>
              <span
                id="near-me-selected-category-count"
                className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900"
              >
                {filteredPlaces.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {userLocation ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    id="near-me-device-location-badge"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl"
                  >
                    <LocateFixed className="w-3.5 h-3.5 text-emerald-600" />
                    {t('Using your device location')}
                  </span>
                  <span
                    id="near-me-distance-radius-badge"
                    className="inline-flex items-center gap-1 font-bold text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-xl"
                  >
                    {distanceRadius === 'all' ? `${t('Radius:')} ${t('All Island')}` : `${t('Radius:')} ${t('Within')} ${distanceRadius} km`}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="text-blue-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  {t('Sort by nearest to me')}
                </button>
              )}
            </div>
          </div>

          {/* Quick Distance Radius Bar for Category View */}
          {userLocation && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-white border border-stone-200/90 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-700 flex items-center gap-1">
                  <LocateFixed className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {t('Radius:')}
                </span>
                <div className="flex items-center gap-1.5">
                  {(['all', '5', '10', '25'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      id={`btn-cat-radius-${r}`}
                      onClick={() => setDistanceRadius(r)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        distanceRadius === r
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {r === 'all' ? t('All Island') : `${t('Within')} ${r} km`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-stone-500 font-medium">
                {distanceRadius === 'all' ? (
                  <span>{t('All Island • Sorted from nearest to farthest')}</span>
                ) : (
                  <span>{t('Filtered within')} <strong className="text-emerald-800">{distanceRadius} km</strong></span>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredPlaces.length === 0 ? (
            <div
              id="near-me-empty-state"
              className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-stone-200 space-y-4 shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              {distanceRadius !== 'all' ? (
                <div className="space-y-3">
                  <h3 id="no-nearby-places-found" className="font-bold text-stone-900 text-lg">
                    {t('No')} {CATEGORY_NAMES_T[activeCategory]} {t('found within')} {distanceRadius} km.
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                    {t('No')} {CATEGORY_NAMES_T[activeCategory]} {t('found within')} <strong className="text-emerald-900">{distanceRadius} km</strong>. {t('Expand your distance radius to view available places across Sri Lanka.')}
                  </p>

                  {/* Option to change the radius */}
                  <div className="pt-2 flex flex-col items-center gap-2">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {distanceRadius === '5' && (
                        <button
                          type="button"
                          id="btn-empty-expand-10"
                          onClick={() => setDistanceRadius('10')}
                          className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-900 text-white hover:bg-blue-950 shadow-xs"
                        >
                          {t('Expand to 10 km')}
                        </button>
                      )}
                      {(distanceRadius === '5' || distanceRadius === '10') && (
                        <button
                          type="button"
                          id="btn-empty-expand-25"
                          onClick={() => setDistanceRadius('25')}
                          className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-900 text-white hover:bg-blue-950 shadow-xs"
                        >
                          {t('Expand to 25 km')}
                        </button>
                      )}
                      <button
                        type="button"
                        id="btn-empty-radius-all"
                        onClick={() => setDistanceRadius('all')}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
                      >
                        {t('Show All Island')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-bold text-stone-900 text-base">{t('No Matching Places Found')}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                    {t('We couldn’t find any')} {CATEGORY_NAMES_T[activeCategory]} {t('matching')} “{searchQuery}”.
                    {t('Try adjusting your search terms or resetting filters.')}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-950 transition-colors cursor-pointer"
                  >
                    {t('Reset Filters')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Places Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlaces.map((place) => {
                const catMeta = NEAR_ME_CATEGORIES.find((c) => c.id === place.category);
                const is24Hours = place.openStatus === 'Open 24 Hours';

                return (
                  <div
                    key={place.id}
                    id={`place-card-${place.id}`}
                    className="bg-white rounded-3xl p-5 border border-stone-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Row: Category Badge, Distance & Open Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                            catMeta?.badgeColor || 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {getCategoryIcon(place.category, 'w-3.5 h-3.5')}
                          <span>{t(place.categoryLabel)}</span>
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Approximate Distance Badge */}
                          {place.distanceKm !== null && (
                            <span
                              id={`place-distance-${place.id}`}
                              className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center gap-1"
                            >
                              <Navigation className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>{formatDistanceKm(place.distanceKm)}</span>
                            </span>
                          )}

                          {/* Open Status Chip */}
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              is24Hours
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {t(place.openStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Place Name & Location */}
                      <div>
                        <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-900 transition-colors leading-snug">
                          {t(place.name)}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="font-semibold text-stone-700">{t(place.area)}</span>
                          <span>•</span>
                          <span>{t(place.city)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {t(place.description)}
                      </p>

                      {/* Services Chips */}
                      <div className="flex flex-wrap gap-1">
                        {place.services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                          >
                            {t(service)}
                          </span>
                        ))}
                        {place.services.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-stone-400 font-bold">
                            +{place.services.length - 3} {t('more')}
                          </span>
                        )}
                      </div>

                      {/* Driving Tip snippet if available */}
                      {place.drivingTip && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-1.5">
                          <Car className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <p className="line-clamp-1 leading-snug">
                            <strong>{t('Tip:')}</strong> {t(place.drivingTip)}
                          </p>
                        </div>
                      )}
                    </div>

                    {CURATED_HOTEL_IDS.has(place.id) && (
                      <p className="mb-2 text-xs text-stone-600">
                        Confirm the hotel location in Google Maps before travelling.
                      </p>
                    )}
                    {/* Action Buttons: Navigate (Very Prominent) & View Details */}
                    <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                      {/* Navigate Button */}
                      <button
                        type="button"
                        id={`btn-navigate-${place.id}`}
                        onClick={() => {
                          openGoogleMapsSearch(place.name, place.address || `${place.area}, ${place.city}`, place.coordinates);
                        }}
                        className="flex-1 py-2.5 px-4 bg-blue-900 hover:bg-blue-950 active:bg-[#0c2340] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs touch-manipulation group/btn"
                        title="Confirm the destination in Google Maps before choosing Directions"
                      >
                        <Navigation className="w-4 h-4 text-amber-300 group-hover/btn:translate-x-0.5 transition-transform" />
                        <span>{t('Navigate')}</span>
                      </button>

                      {/* View Details Button */}
                      <button
                        type="button"
                        id={`btn-details-${place.id}`}
                        onClick={() => setSelectedPlaceForModal(place)}
                        className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
                      >
                        <span>{t('View Details')}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom Banner: Quick Links to Fuel Finder and Interactive Map */}
        <section className="mt-12 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {t('Planning a Full Island Tour?')}
              </h3>
              <p className="text-xs text-stone-500 max-w-xl mt-0.5">
                {t('Explore our curated 7-day road itinerary, find specific petrol & diesel grades with the Fuel Finder, or view all island attractions on the interactive map.')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigatePage('fuel')}
              className="flex-1 md:flex-initial py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Fuel className="w-4 h-4" />
              <span>{t('Fuel Finder')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('map')}
              className="flex-1 md:flex-initial py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MapIcon className="w-4 h-4 text-stone-600" />
              <span>{t('Interactive Map')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('itinerary-7day')}
              className="flex-1 md:flex-initial py-2.5 px-4 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('7-Day Itinerary')}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Place Details Modal */}
      {selectedPlaceForModal && (
        <div
          id="near-me-place-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedPlaceForModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 text-[11px] font-bold">
                    {t(selectedPlaceForModal.categoryLabel)}
                  </span>
                  {selectedPlaceForModal.distanceKm !== null && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-black flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-emerald-700" />
                      <span>{formatDistanceKm(selectedPlaceForModal.distanceKm)} {t('away')}</span>
                    </span>
                  )}
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-bold uppercase">
                    {t('Reference Information')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-stone-900 leading-snug">
                  {t(selectedPlaceForModal.name)}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{t(selectedPlaceForModal.address)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlaceForModal(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t('About this Place')}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {t(selectedPlaceForModal.description)}
              </p>
            </div>

            {/* Driving & Traveler Advisory */}
            {selectedPlaceForModal.drivingTip && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Car className="w-4 h-4 text-amber-700" />
                  <span>{t('Self-Driving & Traveler Advice')}</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {t(selectedPlaceForModal.drivingTip)}
                </p>
              </div>
            )}

            {/* Services & Amenities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t('Services & Amenities')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedPlaceForModal.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-700 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t(srv)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t('Operating Hours')}</span>
                </div>
                <p className="text-xs text-stone-800 font-semibold">
                  {t(selectedPlaceForModal.openingHours)}
                </p>
              </div>

              {selectedPlaceForModal.contactPhone && (
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-600 font-bold text-xs">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{t('Telephone')}</span>
                  </div>
                  <a
                    href={`tel:${selectedPlaceForModal.contactPhone.replace(/\s+/g, '')}`}
                    className="text-xs font-bold text-blue-800 hover:underline block"
                  >
                    {selectedPlaceForModal.contactPhone}
                  </a>
                </div>
              )}
            </div>

            {CURATED_HOTEL_IDS.has(selectedPlaceForModal.id) && (
              <p className="mb-3 text-xs text-stone-600">
                Confirm the hotel location in Google Maps before travelling.
              </p>
            )}
            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                id="btn-modal-navigate"
                onClick={() => {
                  openGoogleMapsSearch(selectedPlaceForModal.name,
                    selectedPlaceForModal.address || `${selectedPlaceForModal.area}, ${selectedPlaceForModal.city}`,
                    selectedPlaceForModal.coordinates);
                }}
                className="w-full sm:flex-1 py-3 px-4 bg-blue-900 hover:bg-blue-950 active:bg-[#0c2340] text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>{t('Navigate in Google Maps')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlaceForModal(null)}
                className="w-full sm:w-auto py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
